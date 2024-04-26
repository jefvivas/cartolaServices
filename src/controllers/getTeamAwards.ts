import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getTeamAwards } from "../services/getTeamAwards";

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

  const awards = await getTeamAwards(team);

  if (!awards) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "awards is undefined",
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
