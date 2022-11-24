import wget
import sys
import urllib.error
import zipfile
import os
from os import walk
import boto3
import json

from botocore.awsrequest import AWSRequest
from botocore.endpoint import URLLib3Session
from botocore.auth import SigV4Auth
from urllib.parse import urlparse

print (sys.version)

# os.environ['AWS_DEFAULT_REGION'] = 'your_region_name'
region = os.environ['REGION']
print(region)
dynamodb = boto3.resource('dynamodb', region_name=region)

# Environment vars
# see https://stackoverflow.com/questions/4906977/how-to-access-environment-variable-values
print(os.environ['FIRMWAREVERSIONID'])
print(os.environ['GRAPHQLAPIURL'])

firmwareVersionId = os.environ['FIRMWAREVERSIONID']
graphQLApiUrl = os.environ['GRAPHQLAPIURL']

# https://stackoverflow.com/questions/38144273/making-a-signed-http-request-to-aws-elasticsearch-in-python
def update_job_status_gql(jobId, jobState, defaultConfigJson=None):
    hostname = urlparse(graphQLApiUrl).hostname
    if(defaultConfigJson != None):
        item = {
            'input': {
                'id': jobId,
                'parseJobState': jobState,
                'defaultConfigJson' : defaultConfigJson
            }
        }
    else:
        item = {
            'input': {
                'id': jobId,
                'parseJobState': jobState
            }
        }
    params = {
            'query':"""
                mutation UpdateFirmwareVersion(
                    $input: UpdateFirmwareVersionInput!
                    $condition: ModelFirmwareVersionConditionInput
                ) {
                    updateFirmwareVersion(input: $input, condition: $condition) {
                    id
                    owner
                    name
                    sourceTree
                    configTree
                    parseJobState
                    defaultConfigJson
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
    #print(json.dumps(params))
    request = AWSRequest(method="POST", url=graphQLApiUrl, data=json.dumps(params), headers=headers)
    SigV4Auth(boto3.Session().get_credentials(), "appsync", region).add_auth(request)    
    session = URLLib3Session()
    r = session.send(request.prepare())
    print("Response status code:")
    print(r.status_code)
    #print("Response body: "+r.text)
    return r    

def get_firmwareVersion(firmwareVersionId):
    print(firmwareVersionId)
    hostname = urlparse(graphQLApiUrl).hostname
    item = {
          'id': firmwareVersionId
    }
    params = {
            'query':"""
                query GetFirmwareVersion($id: ID!) {
                    getFirmwareVersion(id: $id) {
                    id
                    owner
                    name
                    sourceTree
                    configTree
                    parseJobState
                    defaultConfigJson
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
    #print(json.dumps(params))
    request = AWSRequest(method="POST", url=graphQLApiUrl, data=json.dumps(params), headers=headers)
    SigV4Auth(boto3.Session().get_credentials(), "appsync", region).add_auth(request)    
    session = URLLib3Session()
    r = session.send(request.prepare())
    print("Response status code:")
    print(r.status_code)
    return json.loads(r.text)['data']['getFirmwareVersion']    

def updatefailed():
    update_job_status_gql(firmwareVersionId, "FAILED")

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

def getLineWhereMatch(match, text):
    lines = text.splitlines()
    for line in lines:
        if(match in line):
            cleanLine = line.lstrip()
            if(cleanLine.startswith("#")):
                return line
    return

def parseMainboard(filename):
    print("Parsing mainboard file ", filename)
    with open(filename, 'r+', encoding="utf8") as f:
        text = f.read()
        searchFor = "#define MOTHERBOARD"
        line = getLineWhereMatch(searchFor, text)
        print(line)
        right = line.split(searchFor)[1]
        print(right)
        return right.strip()

def parsePinsFile(filename):
    print("Parsing pins.h file ", filename)
    with open(filename, 'r+', encoding="utf8") as f:
        text = f.read()
        searchFor = "#define MOTHERBOARD"
        line = getLineWhereMatch(searchFor, text)
        print(line)
        right = line.split(searchFor)[1]
        print(right)
        return right.strip()

def getEnvironmentsForMainboard(mainboard):
    mainboardSearch = mainboard.split("BOARD_")[1]
    buildOptionsSearch = "MB("+mainboardSearch
    lineNumber = 0
    found = False
    for line in pinsFileLines:
        if(buildOptionsSearch in line):
            buildOptionsLine = pinsFileLines[lineNumber+1]
            found = True
            break
        lineNumber += 1
    if(found):
        print(buildOptionsLine)
        optionsArray = buildOptionsLine.split()
        print(optionsArray)
        environments = list(map(lambda f: f.split(":")[1], filter(lambda c: c.startswith("env:"), optionsArray)))
        print(environments)
        return environments
    else:
        return None        

def parseConfigurationFile(dirpath):
    mainboard = parseMainboard(dirpath+"/Configuration.h")
    environments = getEnvironmentsForMainboard(mainboard)
    if(environments != None):
        return [mainboard, environments]
    else:
        return [None, []]

update_job_status_gql(firmwareVersionId, "RUNNING")

# Get Firmware Version Object and grab config url
versionObj = get_firmwareVersion(firmwareVersionId)
configUrl = versionObj['configTree']
sourceUrl = versionObj['sourceTree']

# init final object
tree = {
    'manufacturers' : [],
    'mainboards' : []
}


# STEP 1
# see https://docs.python.org/3/tutorial/errors.html
# see https://stackoverflow.com/questions/24346872/python-equivalent-of-a-given-wget-command
try:
    print("Downloading sources...")
    sourcefilename = wget.download(sourceUrl, "Marlin.zip")
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

# STEP 3a - Parse PINS.h
pinsFilename = sourcedir+"/Marlin/src/pins/pins.h"
with open(pinsFilename, 'r+', encoding="utf8") as f:
    pinsFileContent = f.read()
    pinsFileLines = pinsFileContent.splitlines()

# STEP 3 - Read Boards.h
boardsFilename = sourcedir+"/Marlin/src/core/boards.h"
with open(boardsFilename, 'r+', encoding="utf8") as f:
    boardsFileContent = f.read()
    boardsFileLines = boardsFileContent.splitlines()

    boardlineSearch = "BOARD_"
    for line in boardsFileLines:
        if boardlineSearch in line:
            splitByComment = line.split('//')
            if(len(splitByComment)>1):
                boardName = splitByComment[0].split()[1]
                boardDescription = splitByComment[1].strip()
                boardEnvironments = getEnvironmentsForMainboard(boardName)
                tree['mainboards'].append({'boardName': boardName, 'boardDescription': boardDescription, 'boardEnvironments': boardEnvironments})

# STEP 3 - Download config zip
try:
    print("Downloading configs...")
    configsfilename = wget.download(configUrl, "Configurations.zip")
    print("done\n")
except urllib.error.HTTPError as err:
    print ("Http error: ",err)
    updatefailed()
    exit(3)
except:
    print("Unexpected error:", sys.exc_info()[0])
    updatefailed()
    exit(3)
    
# STEP 4 - Unpack zip archive
try:
    configsdir = unpackZip(configsfilename)
except:
    print("Unexpected error:", sys.exc_info()[0])
    updatefailed()
    exit(4)


# STEP 3 - Enumerate manufacturers
rootDir = configsdir+"/config/examples"
manuFacturers = []
for (dirpath, dirnames, filenames) in walk(rootDir):
    manuFacturers.extend(dirnames)
    break

# STEP 4 - Enumerate printers for each manufacturer and also the subsequent mainboards if exist
for manufacturer in manuFacturers:
    printerModels = []
    for (dirpath, dirnames, filenames) in walk(rootDir+"/"+manufacturer):
        printerModels.extend(dirnames)
        break
    newManufacturerObj = {
        'name' : manufacturer,
        'printerModels' : []
    }
    tree['manufacturers'].append(newManufacturerObj)
    for printerModel in printerModels:

        printerVariants = []
        for (dirpath, dirnames, filenames) in walk(rootDir+"/"+manufacturer+"/"+printerModel):
            printerVariants.extend(dirnames)
            if("Configuration.h" in filenames):
                result = parseConfigurationFile(dirpath)
            else:
                result = [None, []]
            break
        newPrinterModelObj = {
            'name' : printerModel,
            'variants' : [],
            'mainboard' : result[0],
            'environments': result[1]
        }
        for printerVariant in printerVariants:
            for (dirpath, dirnames, filenames) in walk(rootDir+"/"+manufacturer+"/"+printerModel+"/"+printerVariant):
                if("Configuration.h" in filenames):
                    result = parseConfigurationFile(dirpath)
                    newPrinterModelObj['variants'].append({
                        'name': printerVariant,
                        'mainboard': result[0],
                        'environments': result[1]
                    })
                if(len(dirnames)>0):
                    for printerSubVariant in dirnames:
                        print("printerSubVariant: ", printerSubVariant)  
                        break        
                break

        newManufacturerObj['printerModels'].append(newPrinterModelObj)
#print(json.dumps(tree, indent=3))

print("DONE")
update_job_status_gql(firmwareVersionId, "DONE", json.dumps(tree, indent=3))

