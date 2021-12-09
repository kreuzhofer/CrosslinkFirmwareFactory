const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

const TABLENAME = process.env.TABLENAME;
console.log(TABLENAME);

// helper to get membershipexception entry for user
const getMembershipException = async (email) => 
{
  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "email = :e",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ':e': {S: email},
    },
    // Set the projection expression, which the the attributes that you want.
    ProjectionExpression: "email, patronLevel, roleOverride",
    TableName: TABLENAME,
  };

  result = await new Promise((resolve, reject) => {

    ddb.scan(params, function (err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        console.log("Success", data);
        console.log("Length: "+ data.Items.length)
        if(data.Items.length == 0)
        {
          resolve(null);
        }
        else
        {
          console.log(data.Items[0]);
          resolve(data.Items[0]);
        }
      }
    })
  });
  return result;
}

exports.handler = async (event) => {
  console.log(event);
  const email = event.request.userAttributes.email.toLowerCase();
  console.log(email);
  console.log(event.request.groupConfiguration.preferredRole);
  var originalRole = event.request.groupConfiguration.preferredRole
  var level1Role = event.request.groupConfiguration.preferredRole.split('/')[0]+"/"+event.userPoolId+"-Level1GroupRole"
  console.log(level1Role);
  // get user details
  var getUserParams = {
    UserPoolId: event.userPoolId,
    Username: event.userName
  }
  var userDetails = await cognitoidentityserviceprovider.adminGetUser(getUserParams).promise();
  console.log(userDetails);
  console.log(userDetails.UserCreateDate);
  var userCreateDate = Date.parse(userDetails.UserCreateDate.toString());
  console.log(userCreateDate);
  var now = Date.now();
  console.log(now);
  var diffInDays = Math.trunc((now - userCreateDate)/1000/60/60/24);
  console.log("User created:",diffInDays, "days ago");

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "email = :e",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ':e': {S: email},
    },
    // Set the projection expression, which the the attributes that you want.
    ProjectionExpression: "email, patron_status, currently_entitled_amount_cents",
    TableName: "Patron",
  };
	let patron_level = 0;

  let override = await getMembershipException(email);
  if(override)
  {
    console.log("Patron Level override:"+override.patronLevel.N);
    patron_level = override.patronLevel.N;
    event.response = {
      "claimsOverrideDetails": {
          "claimsToAddOrOverride": {
              "patron_level": patron_level
          },
          "groupOverrideDetails": {
            "groupsToOverride": ["Level1", "Everyone"],
            "iamRolesToOverride": [originalRole, level1Role],
            "preferredRole": level1Role
          }
      }
    };
    return event;
  }  
  else
  {
    console.log("Looking for patron level...")
    result = await new Promise((resolve, reject) => {
      ddb.scan(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          console.log("Success", data);
          console.log("Length: "+ data.Items.length)
          // if(data.Items.length == 0 || data.Items[0].patron_status.S != "active_patron")
          // {
          //   console.error("You're currently not an active Patron! Please become a Patron at the 2$ level or above to use this service.");
          // }
          // else if(data.Items[0].currently_entitled_amount_cents.N < 200)
          // {
          //   console.error("You need to be a Patron at the 2$ level or above to use this service.");
          // }
          // else
          if(data.Items.length > 0)
          {
            if(data.Items[0].currently_entitled_amount_cents.N >= 200)
              patron_level = 1;
            if(data.Items[0].currently_entitled_amount_cents.N >= 500)
              patron_level = 2;
          }
          else if(diffInDays<=30)
          {
            console.log("Patron Level 1 override due to trial period.")
            patron_level = 1;
          }
        }
        var groupsToOverride = (patron_level>0 ? ["Level1", "Everyone"] : null);
        if(groupsToOverride)
          event.response = {
            "claimsOverrideDetails": {
                "claimsToAddOrOverride": {
                    "patron_level": patron_level
                },
                "groupOverrideDetails": {
                  "groupsToOverride": groupsToOverride,
                  "iamRolesToOverride": [originalRole, level1Role],
                  "preferredRole": level1Role
                }
            }
          }
        else
          event.response = {
            "claimsOverrideDetails": {
                "claimsToAddOrOverride": {
                    "patron_level": patron_level
                }
            }
          };
        console.log(event.response);
          // Return to Amazon Cognito
        console.log(event);
        resolve (event);
      });
    });
    return result;
  }
};
