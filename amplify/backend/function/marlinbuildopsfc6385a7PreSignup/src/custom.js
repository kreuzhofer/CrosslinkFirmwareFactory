const AWS = require("aws-sdk");
const cognitoIdp = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const TABLENAME = process.env.TABLENAME;
console.log(TABLENAME);
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


exports.handler = (event, context, callback) => {
  console.log(event)

  // check if email is already in use
  if (event.request.userAttributes.hasOwnProperty('email')) {
    const email = event.request.userAttributes.email.toLowerCase();
    console.log(email)

    const params = {
      UserPoolId: event.userPoolId,
      Filter: 'email = "' + email + '"',
    };
    
    cognitoIdp.listUsers(params).promise()
    .then (async (results) => {
      console.log(JSON.stringify(results));
      // if the usernames are the same, dont raise and error here so that
      // cognito will raise the duplicate username error
      if (results.Users.length > 0 && results.Users[0].Username !== event.userName) {
        console.log('Duplicate email address in signup. ' + email);
        context.done(Error('A user with the same email address exists'));
      }
      else
      {
        // Scan for overrides first
        let override = await getMembershipException(email);
        if(override)
        {
          console.log("Patron Level override:"+override.patronLevel.N);
          context.done(null, event);
          return;
        }

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
        
        ddb.scan(params, function (err, data) {
          if (err) {
            console.log("Error", err);
            var error = new Error(err);
            context.done(error);
          } else {
            console.log("Success", data);
            console.log("Length: "+ data.Items.length)
            if(data.Items.length == 0 || data.Items[0].patron_status.S != "active_patron")
            {
              var error = new Error("You're currently not an active Patron! Please become a Patron at the 2$ level or above to use this service.");
              context.done(error);
            }
            else if(data.Items[0].currently_entitled_amount_cents.N < 200)
            {
              var error = new Error("You need to be a Patron at the 2$ level or above to use this service.");
              context.done(error);
            }
            else
            {
              data.Items.forEach(function (element, index, array) {
                console.log(element);
              });
              context.done(null, event);
            }
          }
        });
      }
    })
    .catch (error => {
      console.error(error);
      context.done(error);      
    });
  }


};
