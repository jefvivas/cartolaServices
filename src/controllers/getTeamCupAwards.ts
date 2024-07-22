import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getTeamAwards } from "../services/getTeamAwards";
import { getTeamCupAwardsById } from "../repository/getTeamCupAwards";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "QueryStringParameters is undefined",
      }),
    };
    return response;
  }

  const { team } = event.queryStringParameters;

  if (!team) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "team is undefined",
      }),
    };
    return response;
  }

  const awards = await getTeamCupAwardsById(team);

  if (!awards) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Cup Award is undefined",
      }),
    };

    return response;
  }

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify(awards),
  };
  return response;
}

export { handler };
