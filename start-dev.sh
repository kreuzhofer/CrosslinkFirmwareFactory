#!/bin/sh
export REACT_APP_BUILDAGENTJOBQUEUEURL="https://sqs.eu-west-1.amazonaws.com/416703677996/BuildAgentJobQueue"
export REACT_APP_BUILDARTIFACTS_BUCKET="firmwarefactory-userdata144111-dev"
export REACT_APP_BUILDDEFINITIONTABLENAME="BuildDefinition-j53p7syr7fhirohy2zu7o7gueq-dev"
export REACT_APP_BUILDJOBTABLENAME="BuildJob-j53p7syr7fhirohy2zu7o7gueq-dev"
export REACT_APP_ENV="dev"
export REACT_APP_FIRMWAREVERSIONTABLENAME="FirmwareVersion-j53p7syr7fhirohy2zu7o7gueq-dev"
export REACT_APP_GRAPHQLAPIURL="https://mt5mcupbzrc7xltxg7ezjesdje.appsync-api.eu-west-1.amazonaws.com/graphql"
export REACT_APP_REST_API_BASEURL="https://7wk5ladyv6.execute-api.eu-west-1.amazonaws.com/"

NODE_OPTIONS=--openssl-legacy-provider npm start