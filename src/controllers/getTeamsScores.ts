import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getTeamsScores } from "../services/getTeamsScores";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

async function handler(): Promise<APIGatewayProxyResult> {
  const item = await getTeamsScores();

  if (!item) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "item is undefined",
      }),
    };

    return response;
  }

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      scores: item,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
  };
  return response;
}

export { handler };
