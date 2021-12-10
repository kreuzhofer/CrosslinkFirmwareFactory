import subprocess
import distutils
from distutils import util
import wget
import sys
import urllib.error
import tarfile
import zipfile
import os
import boto3
import json
from botocore.exceptions import ClientError
import re
try:
    from configparser import ConfigParser
except ImportError:
    from ConfigParser import ConfigParser  # ver. < 3.0
from botocore.awsrequest import AWSRequest
from botocore.endpoint import URLLib3Session
from botocore.auth import SigV4Auth
from urllib.parse import urlparse

print (sys.version)

# os.environ['AWS_DEFAULT_REGION'] = 'your_region_name'
region = os.environ['REGION']
print(region)
dynamodb = boto3.resource('dynamodb', region_name=region)
s3_client = boto3.client('s3', region_name=region)
sqs = boto3.client('sqs', region_name=region)

# Environment vars
# see https://stackoverflow.com/questions/4906977/how-to-access-environment-variable-values
print(os.environ['SOURCEURL'])
print(os.environ['CONFIGURL'])
print(os.environ['MANUFACTURER'])
print(os.environ['PRINTERMODEL'])
if('PRINTERMAINBOARD' in os.environ and os.environ['PRINTERMAINBOARD'] != "None"):
    print(os.environ['PRINTERMAINBOARD'])
    printerMainboard = os.environ['PRINTERMAINBOARD']
else:
    printerMainboard = ""
print(os.environ['PLATFORMIOENV'])
print(os.environ['INSTANCE_ID'])
print(os.environ['NAME'])
print(os.environ['BUILDJOBID'])
print(os.environ['GRAPHQLAPIURL'])
print(os.environ['BUILDARTIFACTSBUCKET'])
print(os.environ['BUILDJOBTABLENAME'])
print(os.environ['BUILDDEFINITIONTABLENAME'])

sourceurl = os.environ['SOURCEURL']
configurl = os.environ['CONFIGURL']
manufacturer = os.environ['MANUFACTURER']
printermodel = os.environ['PRINTERMODEL']
platformioenv = os.environ['PLATFORMIOENV']
instanceid = os.environ['INSTANCE_ID']
buildDefinitionId = os.environ['NAME']
buildJobId = os.environ['BUILDJOBID']
graphQLApiUrl = os.environ['GRAPHQLAPIURL']
buildArtifactsBucket = os.environ['BUILDARTIFACTSBUCKET']
buildJobTableName = os.environ['BUILDJOBTABLENAME']
buildDefinitionTableName = os.environ['BUILDDEFINITIONTABLENAME']

# def update_job_status(jobId, jobState, dynamodb=None):
#     if not dynamodb:
#         dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

#     table = dynamodb.Table('BuildJob-nnf2gyqbpzc7fiethifhs24yqq-prod')

#     response = table.update_item(
#         Key={
#             'id': jobId,
#         },
#         UpdateExpression="set jobState=:s",
#         ExpressionAttributeValues={
#             ':s': jobState
#         },
#         ReturnValues="UPDATED_NEW"
#     )
#     return response

# https://stackoverflow.com/questions/38144273/making-a-signed-http-request-to-aws-elasticsearch-in-python
def update_job_status_gql(jobId, jobState):
    hostname = urlparse(graphQLApiUrl).hostname
    item = {
        'input': {
            'id': jobId,
            'jobState': jobState
        }
    }
    params = {
            'query':"""
                mutation UpdateBuildJob(
                    $input: UpdateBuildJobInput!
                    $condition: ModelBuildJobConditionInput
                ) {
                    updateBuildJob(input: $input, condition: $condition) {
                    id
                    buildDefinitionID
                    jobState
                    startTime
                    endTime
                    message
                    log
                    createdAt
                    updatedAt
                    owner
                    }
                }
            """,
            'variables': item
        }
    headers = {
        'Host': hostname,
        'Content-Type' : 'application/json'
    }
    print(json.dumps(params))
    request = AWSRequest(method="POST", url=graphQLApiUrl, data=json.dumps(params), headers=headers)
    SigV4Auth(boto3.Session().get_credentials(), "appsync", "eu-west-1").add_auth(request)    
    session = URLLib3Session()
    r = session.send(request.prepare())
    print("Response status code:")
    print(r.status_code)
    print("Response body: "+r.text)
    return r    

def create_buildArtifact(artifactName, artifactFileName):
    hostname = urlparse(graphQLApiUrl).hostname
    item = {
        'input' : {
            'buildJobID' : buildJobId,
            'artifactName' : artifactName,
            'artifactFileName' : artifactFileName
            }
        }

    params = {
        'query' : """
            mutation CreateBuildJobArtifact(
                $input: CreateBuildJobArtifactInput!
                $condition: ModelBuildJobArtifactConditionInput
            ) {
                createBuildJobArtifact(input: $input, condition: $condition) {
                id
                buildJobID
                artifactName
                artifactFileName
                owner
                createdAt
                updatedAt
                }
            }
          """,
        'variables': item
        }
    headers = {
        'Host': hostname,
        'Content-Type' : 'application/json'
    }
    print(json.dumps(params))
    request = AWSRequest(method="POST", url=graphQLApiUrl, data=json.dumps(params), headers=headers)
    SigV4Auth(boto3.Session().get_credentials(), "appsync", "eu-west-1").add_auth(request)    
    session = URLLib3Session()
    r = session.send(request.prepare())
    print("Response status code:")
    print(r.status_code)
    print("Response body: "+r.text)
    return r   

def get_buildDefinition(buildDefinitionID, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

    table = dynamodb.Table(buildDefinitionTableName)

    try:
        response = table.get_item(Key={'id': buildDefinitionID})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response['Item'] 

def getLineWhereMatch(match, text):
    lines = text.splitlines()
    for line in lines:
        if(match in line):
            cleanLine = line.lstrip()
            if(cleanLine.startswith("#")):
                return line
    return

def replaceInFile(filename, replacements):
    with open(filename, 'r+', encoding="utf8") as f:
        text = f.read()

        for rep in replacements:
            print(rep)
            desiredState = bool(distutils.util.strtobool(rep['enabled']))
            insertAfter = None
            if("insertafter" in rep):
                insertAfter = rep['insertafter']

            key = rep['key']
            if(insertAfter is None):
                searchForKey = "#define "+key
            else:
                searchForKey = "#define "+insertAfter

            hasValue = False
            if("value" in rep):
                newValue = rep['value']
                hasValue = True

            # check if key exists in file
            if(searchForKey not in text):
                print("Not found: "+key)
                continue

            if(insertAfter is not None):
                oldLines = text.splitlines()
                newLines = []
                for line in oldLines:
                    newLines.append(line)
                    if(searchForKey in line):
                        if(hasValue):
                            newLines.append("#define "+key+" "+newValue)
                        else:
                            newLines.append("#define "+key)
                text = '\n'.join(newLines)
            else:
                if desiredState: # switch should be enabled and optionally has value
                    toFind = "//"+searchForKey
                    while(toFind in text): # switch currently disabled, first enable it
                        text = re.sub(toFind, searchForKey, text)
                    else:
                        print("Alread enabled: "+key)
                    if(hasValue):
                        line = getLineWhereMatch(searchForKey, text)
                        leadingSpaces = len(line) - len(line.lstrip())
                        while(line is not None and not (searchForKey+" "+newValue) in line):
                            print("Found: '"+line+"'")
                            newLine = (' ' * leadingSpaces) + searchForKey+" "+newValue
                            print("Replacing with: "+newLine)
                            text = text.replace(line, newLine, 1)
                            
                            line = getLineWhereMatch(searchForKey, text)
                            leadingSpaces = len(line) - len(line.lstrip())
                else: # switch should be disabled
                    toFind = "//"+searchForKey
                    if(toFind in text):
                        print("Already disabled: "+key)
                    else:
                        text = re.sub(searchForKey, toFind, text)

        f.seek(0)
        f.write(text)
        f.truncate()


#def uploadLog():
    # finally upload logfile to S3
#    upload_file('/tmp/part-001.log', 'marlinbuildartifacts', buildJobId+"/"+"logfile.txt")

def updatefailed():
    update_job_status_gql(buildJobId, "FAILED")
#    uploadLog()

def unpacktar(filename):
    tar = tarfile.open(filename, "r:gz")
    first = tar.firstmember
    if first.isdir():
        print(first.name, "is", first.size, "bytes in size and is ", end="")
        print("a directory.")
        root = first.name # save root dir for later
    tar.close()    

    print ("Unpacking ",filename,"...")
    tar = tarfile.open(filename)
    tar.extractall()
    tar.close()
    print("done\n")
    return root

def unpackZip(path_to_zip_file):
    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        count = 0
        for name in zip_ref.namelist():
            if(count == 0):
                first = name
            count+=1
            zip_ref.extract(name)
    zip_ref.close()
    return first.strip("/")
    
# see https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-uploading-files.html#:~:text=The%20AWS%20SDK%20for%20Python,uploading%20each%20chunk%20in%20parallel
def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
        #response = s3_client.upload_file(file_name, bucket, object_name, ExtraArgs={'ACL': 'public-read'})
        print (response)
    except ClientError as e:
        print(e)
        return False
    return True

update_job_status_gql(buildJobId, "RUNNING")

# STEP 1
# see https://docs.python.org/3/tutorial/errors.html
# see https://stackoverflow.com/questions/24346872/python-equivalent-of-a-given-wget-command
try:
    print("Downloading sources...")
    sourcefilename = wget.download(sourceurl, "Marlin.zip")
    print("done\n")
except urllib.error.HTTPError as err:
    print ("Http error: ",err)
    updatefailed()
    exit(1)
except:
    print("Unexpected error:", sys.exc_info()[0])
    updatefailed()
    exit(1)
    
# STEP 2
# see https://docs.python.org/3/library/tarfile.html    
try:
    sourcedir = unpackZip(sourcefilename)
except:
    print("Unexpected error:", sys.exc_info()[0])
    updatefailed()
    exit(2)

# only download config zip if it is actually a http url, else it is a sub directory
if(configurl.startswith("http")):
    # STEP 3 
    try:
        print("Downloading configs...")
        configsfilename = wget.download(configurl, "Configurations.zip")
        print("done\n")
    except urllib.error.HTTPError as err:
        print ("Http error: ",err)
        updatefailed()
        exit(3)
    except:
        print("Unexpected error:", sys.exc_info()[0])
        updatefailed()
        exit(3)
        
    # STEP 4
    try:
        configsdir = unpackZip(configsfilename)
    except:
        print("Unexpected error:", sys.exc_info()[0])
        updatefailed()
        exit(4)
    
    # STEP 5a
    # Copy config files
    # Invoke the shell script (without shell involvement)
    # and pass its output streams through.
    # run()'s return value is an object with information about the completed process.
    if(printerMainboard):
        print("Copy model config files...")
        copycommand = "cp ./"+configsdir+"/config/examples/"+manufacturer.replace(' ','\\ ')+"/"+printermodel.replace(' ','\\ ')+"/*.h ./"+sourcedir+"/Marlin/."
        print(copycommand)
        completedProc = subprocess.run(copycommand, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        print(completedProc.stdout.decode("utf-8"))
        # Print the exit code.
        print("Copy model config files result: ",completedProc.returncode)

        print("Copy mainboard config files...")
        copycommand = "cp ./"+configsdir+"/config/examples/"+manufacturer.replace(' ','\\ ')+"/"+printermodel.replace(' ','\\ ')+"/"+printerMainboard.replace(' ','\\ ')+"/*.h ./"+sourcedir+"/Marlin/."
        completedProc = subprocess.run(copycommand, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        print(completedProc.stdout.decode("utf-8"))
        # Print the exit code.
        print("Copy mainboard config files result: ",completedProc.returncode)
    else:
        copycommand = "cp ./"+configsdir+"/config/examples/"+manufacturer.replace(' ','\\ ')+"/"+printermodel.replace(' ','\\ ')+"/*.h ./"+sourcedir+"/Marlin/."
        print(copycommand)
        completedProc = subprocess.run(copycommand, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
        print(completedProc.stdout.decode("utf-8"))
        # Print the exit code.
        print("Copy config files result: ",completedProc.returncode)

else: # configurl is just a subdirectory of the sourcedir
    print("sourcedir is just a subdirectory of the Marlin source folder:")
    copycommand = "cp ./"+sourcedir+"/"+configurl.strip(' /').replace(' ','?')+"/*.* ./"+sourcedir+"/Marlin/."
    print(copycommand)
    completedProc = subprocess.run(copycommand, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    print(completedProc.stdout.decode("utf-8"))
    # Print the exit code.
    print(completedProc.returncode)

# STEP 5b
# apply custom settings
print("Step 5b")
buildDefinition = get_buildDefinition(buildDefinitionId, dynamodb)
configurationJSON = buildDefinition['configurationJSON']
if configurationJSON == "":
    print("Empty configuration JSON, skipping...")
else:
    print(configurationJSON)
    configObj = json.loads(configurationJSON)
    if 'headerfiles' in configObj.keys():
        headerReplacements = configObj['headerfiles']
        for headerFile in headerReplacements:
            fileName = sourcedir+'/'+headerFile['filename']
            if(not os.path.exists(fileName)):
                print("Header file not found!")
            else:
                print("Found header file "+fileName)
            fileReplacements = headerFile['settings']
            print("Settings: ")
            print(fileReplacements)
            replaceInFile(fileName, fileReplacements)

# STEP 6
# Compile firmware
print("Step 6")
os.chdir(sourcedir)
buildcommand = "/root/.platformio/penv/bin/platformio run -e "+platformioenv
print("Starting build")
print(buildcommand)
completedProc = subprocess.run(buildcommand, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
# Print the exit code.
print("Build exit code")
print(completedProc.returncode)
# Create log file with output
pioLog = completedProc.stdout.decode("utf-8")
pioLogfile = open("platformio_log.txt", "w")
pioLogfile.write(pioLog)
pioLogfile.close()
try:
    upload_file("platformio_log.txt", buildArtifactsBucket, "public/"+buildJobId+"/platformio_log.txt")
    create_buildArtifact("PlatformIO log", "platformio_log.txt")
except:
    print("Unexpected error:", sys.exc_info()[0])
    updatefailed()
    exit(6)

# STEP 7
# Upload Firmware to S3
filePathPrefix = ".pio/build/"+platformioenv+"/firmware."
filePath = ".pio/build/"+platformioenv
fileName = ""
for file in os.listdir(filePath):
    if(file.endswith(".bin") or file.endswith(".hex")):
        fileName = file
        break
if(fileName != ""):
    try:
        upload_file(".pio/build/"+platformioenv+"/"+fileName, buildArtifactsBucket, "public/"+buildJobId+"/"+fileName)
        create_buildArtifact("Marlin firmware binary", fileName)
    except:
        print("Unexpected error:", sys.exc_info()[0])
        updatefailed()
        exit(7)
else:
    print("No firmware file found")
    updatefailed()
    exit(7)

# STEP 8
# Upload Firmware Source archive to S3

# Clean first
buildcommand = "/root/.platformio/penv/bin/platformio run --target clean -e "+platformioenv
print("Starting clean")
print(buildcommand)
completedProc = subprocess.run(buildcommand, shell=True)
# Print the exit code.
print("Clean exit code")
print(completedProc.returncode)

# Zip up the sources
print("Switching back to /tmp")
os.chdir('/tmp')
print("Zipping up sources")
tgzcommand = "zip marlin.zip "+sourcedir+" -r"
print(tgzcommand)
completedProc = subprocess.run(tgzcommand, shell=True)
# Print the exit code.
print(completedProc.returncode)
try:
    upload_file("marlin.zip", buildArtifactsBucket, "public/"+buildJobId+"/marlin.zip")
    create_buildArtifact("Marlin Sourcecode", "marlin.zip")
except:
    print("Unexpected error:", sys.exc_info()[0])
    updatefailed()
    exit(8)

# STEP 8
# send message to sqs queue to notify platform of successful build

# Create SQS client

# queue_url = 'https://sqs.eu-west-1.amazonaws.com/709985471261/firmwarebuildnotifications'

# # Send message to SQS queue
# response = sqs.send_message(
#     QueueUrl=queue_url,
#     DelaySeconds=10,
#     MessageAttributes={
#         'Instance': {
#             'DataType': 'String',
#             'StringValue': instanceid
#         }
#     },
#     MessageBody=(
#         '{"firmwareurl":"TODO"}'
#     )
# )

print("DONE")
update_job_status_gql(buildJobId, "DONE")

