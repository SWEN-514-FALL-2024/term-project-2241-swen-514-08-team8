// authService.ts
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    AuthFlowType,
  } from "@aws-sdk/client-cognito-identity-provider";

  const authConfig = {
    UserPoolId: "YOUR_USER_POOL_ID",
    ClientId: "YOUR_CLIENT_ID",
    Region: "us-east-1", // Adjust this to your region
  };
  
  const cognitoClient = new CognitoIdentityProviderClient({ region: authConfig.Region });
  
  export async function signUpUser(username: string, password: string) {
    const command = new SignUpCommand({
      ClientId: authConfig.ClientId,
      Username: username,
      Password: password,
    });
    
    try {
      const response = await cognitoClient.send(command);
      console.log("User signed up:", response);
      return response;
    } catch (error) {
      console.error("Error signing up user:", error);
      throw error;
    }
  }
  
  export async function loginUser(username: string, password: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: authConfig.ClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });
  
    try {
      const response = await cognitoClient.send(command);
      console.log("User logged in:", response);
      return response.AuthenticationResult?.AccessToken;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }
  