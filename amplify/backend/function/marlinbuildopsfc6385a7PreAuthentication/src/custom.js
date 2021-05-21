const AWS = require("aws-sdk");
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

exports.handler = async (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  console.log(event)
  const email = event.request.userAttributes.email.toLowerCase();
  console.log(email)

  // Scan for overrides first
  let override = await getMembershipException(email);
  if(override)
  {
    console.log("Patron Level override:"+override.patronLevel.N);
    context.done(null, event);
    return;
  }

  // var params = {
  //   TableName: 'Patron-nnf2gyqbpzc7fiethifhs24yqq-prod',
  //   Key: {
  //     'email': {S: email}
  //   },
  //   ProjectionExpression: 'email, active_patron'
  // };
  
  // // Call DynamoDB to read the item from the table
  // ddb.getItem(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.Item);
  //   }
  // });

  // var params = {
  //   ExpressionAttributeValues: {
  //     ':e': {S: email},
  //   },
  //   KeyConditionExpression: 'patronsByEmail = :e',
  //   ProjectionExpression: 'email, active_patron',
  //   TableName: 'Patron-nnf2gyqbpzc7fiethifhs24yqq-prod'
  // };
  
  // ddb.query(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     //console.log("Success", data.Items);
  //     data.Items.forEach(function(element, index, array) {
  //       console.log(element.email.S + " (" + element.active_patron.S + ")");
  //     });
  //   }
  // });

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
      callback(error, event);
    } else {
      console.log("Success", data);
      console.log("Length: "+ data.Items.length)
      if(data.Items.length == 0 || data.Items[0].patron_status.S != "active_patron")
      {
        var error = new Error("You're currently not an active Patron! Please become a Patron at the 2$ level or above to use this service.");
        callback(error, event);
      }
      else if(data.Items[0].currently_entitled_amount_cents.N < 200)
      {
        var error = new Error("You need to be a Patron at the 2$ level or above to use this service.");
        callback(error, event);
      }
      else
      {
        data.Items.forEach(function (element, index, array) {
          console.log(element);
        });
        callback(null, event);
      }
    }
  });
  
};
