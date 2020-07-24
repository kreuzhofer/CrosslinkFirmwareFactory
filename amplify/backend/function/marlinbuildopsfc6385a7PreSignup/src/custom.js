exports.handler = (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  const email = event.request.userAttributes.email.split('.')
  const domain = email[email.length - 1]

  if (domain === 'it') {
    callback("Not possible for Italy");
  }
  else {
    callback(null, event);
  }
};
