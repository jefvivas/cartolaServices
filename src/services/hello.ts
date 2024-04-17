import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

async function handler(context: Context, event: APIGatewayProxyEvent) {
  await ddbClient.send(
    new PutItemCommand({
      TableName: "CartolaTable",
      Item: {
        id: { S: "1" },
      },
    })
  );

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
  return response;
}

export { handler };
