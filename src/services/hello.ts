import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";

async function handler(context: Context, event: APIGatewayProxyEvent) {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
  return response;
}

export { handler };
