const aws = require('aws-sdk');
const Mixpanel = require('mixpanel');

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

exports.handler = async event => {
  const groupParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
  };
  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };
  /**
   * Check if the group exists; if it doesn't, create it.
   */
  /**
  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }
  */
  /**
   * Then, add the user to the group.
   */
  await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
  console.info("Added user "+addUserParams.Username+" to group "+addUserParams.GroupName);
  var mixpanel = Mixpanel.init('b797e33ed9db411af6893878c06f6522',
  {
    protocol: 'https'
  });
  var res = mixpanel.track("Sign_Up_Complete");
  console.info(res);

  return event;
};
