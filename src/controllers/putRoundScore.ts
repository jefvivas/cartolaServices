import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import axios from "axios";
import { getTeamsIds } from "../services/getTeamsIds";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { putNewScore } from "../repository/updateScore";
import { getItems } from "../repository/getItemsById";
import { updateAward } from "../repository/updateAward";

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

  const currentRoundScores = [];

  for (let i = 0; i < teamsIds.length; i++) {
    const axiosResponse = await axios.get(
      `https://api.cartola.globo.com/time/id/${teamsIds[i]}/${round}`
    );

    const roundScoreResponse = parseFloat(axiosResponse.data.pontos);
    const roundScore = Math.round(roundScoreResponse * 100) / 100;

    const item = await getItems(teamsIds[i]);
    const team = unmarshall(item);
    currentRoundScores.push({
      score: roundScore,
      teamId: teamsIds[i],
      award: team.award,
    });

    await putNewScore(team.scores, roundScore, teamsIds[i]);
  }

  currentRoundScores.sort((a, b) => b.score - a.score);

  await updateAward(
    currentRoundScores[0].award || 0,
    currentRoundScores[0].teamId,
    15
  );
  await updateAward(
    currentRoundScores[1].award || 0,
    currentRoundScores[1].teamId,
    9
  );
  await updateAward(
    currentRoundScores[2].award || 0,
    currentRoundScores[2].teamId,
    5
  );

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      message: "Scored successfully inserted",
    }),
  };
  return response;
}

export { handler };
