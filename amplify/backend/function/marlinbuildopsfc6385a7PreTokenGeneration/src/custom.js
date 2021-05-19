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
    TableName: "Patron",
  };
	let patron_level = 0;
  
  ddb.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
      console.log("Length: "+ data.Items.length)
      if(data.Items.length == 0 || data.Items[0].patron_status.S != "active_patron")
      {
        console.error("You're currently not an active Patron! Please become a Patron at the 2$ level or above to use this service.");
      }
      else if(data.Items[0].currently_entitled_amount_cents.N < 200)
      {
        console.error("You need to be a Patron at the 2$ level or above to use this service.");
      }
      else
      {
				if(data.Items[0].currently_entitled_amount_cents.N >= 200)
					patron_level = 1;
				if(data.Items[0].currently_entitled_amount_cents.N >= 500)
					patron_level = 2;
      }
    }

		event.response = {
			"claimsOverrideDetails": {
					"claimsToAddOrOverride": {
							"patron_level": patron_level
					}
			}
		};
			// Return to Amazon Cognito
		console.log(event);
		callback(null, event);
  });
};
