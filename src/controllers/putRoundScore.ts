import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import axios from "axios";
import { getTeamsIds } from "../services/getTeamsIds";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { putNewScore } from "../repository/updateScore";
import { getItems } from "../repository/getItemsById";

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

  for (let i = 0; i < teamsIds.length; i++) {
    const axiosResponse = await axios.get(
      `https://api.cartola.globo.com/time/id/${teamsIds[i]}/${round}`
    );

    const roundScoreResponse = parseFloat(axiosResponse.data.pontos);
    const roundScore = Math.round(roundScoreResponse * 100) / 100;

    const item = await getItems(teamsIds[i]);
    const team = unmarshall(item);

    await putNewScore(team.scores, roundScore, teamsIds[i]);
  }

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      message: "Scored successfully inserted",
    }),
  };
  return response;
}

export { handler };