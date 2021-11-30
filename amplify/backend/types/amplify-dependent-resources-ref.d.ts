export type AmplifyDependentResourcesAttributes = {
    "api": {
        "marlinbuildopsapi": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "auth": {
        "marlinbuildopsfc6385a7": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string",
            "CreatedSNSRole": "string"
        },
        "userPoolGroups": {
            "AdminGroupRole": "string",
            "Level1GroupRole": "string",
            "EveryoneGroupRole": "string"
        }
    },
    "function": {
        "AddBuildDefinitionFromWebHook": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "marlinbuildopsfc6385a7PostConfirmation": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "marlinbuildopsfc6385a7PreTokenGeneration": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "marlinbuildopsfc6385a7PreAuthentication": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "marlinbuildopsfc6385a7PreSignup": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "parsemarlinversionfunction": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "storage": {
        "userdata": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}