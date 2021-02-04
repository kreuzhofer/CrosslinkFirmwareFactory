const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
  console.log(event)
  const email = event.request.userAttributes.email
  console.log(email)
  var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "email = :e",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ':e': {S: email},
    },
    // Set the projection expression, which the the attributes that you want.
    ProjectionExpression: "email, patron_status, currently_entitled_amount_cents",
    TableName: "Patron-nnf2gyqbpzc7fiethifhs24yqq-prod",
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
        var error = new Error("You're currently not an active Patron! Please become a Patron at the 5$ level or above to use this service.");
        callback(error, event);
      }
      else if(data.Items[0].currently_entitled_amount_cents.N < 500)
      {
        var error = new Error("You need to be a Patron at the 5$ level or above to use this service.");
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
