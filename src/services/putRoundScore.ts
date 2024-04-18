import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import axios from "axios";
import { getTeamsIds } from "../database/getTeamsIds";

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

  const { round } = event.queryStringParameters;

  if (!round) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "round is undefined",
      }),
    };
    return response;
  }

  const teamsIds = await getTeamsIds();

  console.log(teamsIds);

  for (let i = 0; i < teamsIds.length; i++) {
    const roundScore = await axios.get(
      `https://api.cartola.globo.com/time/id/${teamsIds[i]}/${round}`
    );
  }

  //do something

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      message: "Teams created successfully",
    }),
  };
  return response;
}

export { handler };
