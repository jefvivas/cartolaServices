import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { getTeamsIds } from "../services/getTeamsIds";
import { putNewScore } from "../repository/updateScore";
import { getItemsById } from "../repository/getItemsById";
import { updateAward } from "../repository/updateAward";
import { getTeamScore } from "../utils/axios/getTeamScore";
import { updateNetWorth } from "../repository/updateNetWorth";
import { updateTotalScore } from "../repository/updateTotalScore";

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
    const { roundScore, netWorth, totalScore } = await getTeamScore(
      teamsIds[i],
      round
    );

    const team = await getItemsById(teamsIds[i]);

    currentRoundScores.push({
      score: roundScore,
      teamId: teamsIds[i],
      awards: team.award,
    });

    await putNewScore(team.scores, roundScore, teamsIds[i]);
    await updateNetWorth(teamsIds[i], netWorth);
    await updateTotalScore(teamsIds[i], totalScore);
  }

  currentRoundScores.sort((a, b) => b.score - a.score);

  for (let i = 0; i < currentRoundScores.length; i++) {
    if (i == 0) {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        15
      );
    } else if (i == 1) {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        9
      );
    } else if (i == 2) {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        5
      );
    } else {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        0
      );
    }
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
