#!/bin/bash -x
exec > /tmp/part-001.log 2>&1

sudo apt install jq zip -y

# get ami and instance tags to environment variables
# see https://medium.com/@seb.nyberg/passing-tags-as-environment-variables-to-an-ec2-instance-12b64e69891e
REGION=`curl -s http://169.254.169.254/latest/dynamic/instance-identity/document|grep region|awk -F\" '{print $4}'`
INSTANCE_ID=$(curl --silent http://169.254.169.254/latest/meta-data/instance-id)

export_statement=$(aws ec2 describe-tags --region "$REGION" \
                        --filters "Name=resource-id,Values=$INSTANCE_ID" \
                        --query 'Tags[?!contains(Key, `:`)].[Key,Value]' \
                        --output text | \
                        sed -E 's/^([^\s\t]+)[\s\t]+([^\n]+)$/export \1="\2"/g')
eval $export_statement

# export instance info
export INSTANCE_ID
export REGION

# make python command available via symlink
sudo ln -s /usr/bin/python3 /usr/bin/python

# https://stackoverflow.com/questions/40377662/boto3-client-noregionerror-you-must-specify-a-region-error-only-sometimes
pip3 install wget boto3
pip3 install --upgrade awscli
cd /tmp
python3 -c "$(curl -fsSL https://marlinbuildagentscripts.s3.eu-central-1.amazonaws.com/marlin_default_config_enumerator.py)"
if [ $? -ne 0 ]; then
    echo "Python borked it with exit code $?"
    aws --region "eu-west-1" dynamodb update-item --table-name "$BUILDJOBTABLENAME" --key '{"id":{"S":"'$BUILDJOBID'"}}' --update-expression 'SET jobState=:s' --expression-attribute-values '{":s":{"S":"FAILED"}}'
fi
aws s3 cp /tmp/part-001.log s3://$BUILDARTIFACTSBUCKET/public/$BUILDJOBID/logfile.txt
shutdown now