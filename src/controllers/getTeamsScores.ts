import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getTeamsScores } from "../services/getTeamsScores";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const items = await getTeamsScores();

  if (!items) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "items is undefined",
      }),
    };

    return response;
  }

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      scores: items,
    }),
  };
  return response;
}

export { handler };
