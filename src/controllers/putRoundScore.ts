import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { getTeamsIds } from "../services/getTeamsIds";
import { putNewScore } from "../services/updateScore";
import { getItemsById } from "../services/getItemsById";
import { updateAward } from "../services/updateAward";
import { getTeamScore } from "../utils/axios/getTeamScore";
import { updateNetWorth } from "../services/updateNetWorth";
import { getAllTeamsData } from "../services/getAllTeams";
import { updateHalfChampionshipAward } from "../services/updateHalfChampionshipAward";
import { updateSecondHalfChampionshipAward } from "../services/updateSecondHalfChampionshipAward";
import { updateChampionshipAward } from "../services/updateChampionshipAward";
import { updateRicherAward } from "../services/updateRicherAward";

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
    const { roundScore, netWorth } = await getTeamScore(teamsIds[i], round);

    const team = await getItemsById(teamsIds[i]);

    currentRoundScores.push({
      score: roundScore,
      teamId: teamsIds[i],
      awards: team.award,
    });

    await putNewScore(team.scores, roundScore, teamsIds[i]);
    await updateNetWorth(teamsIds[i], netWorth);
  }

  currentRoundScores.sort((a, b) => b.score - a.score);

  for (let i = 0; i < currentRoundScores.length; i++) {
    if (i == 0) {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        Number(process.env.ROUND_WINNER)
      );
    } else if (i == 1) {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        Number(process.env.ROUND_SECOND)
      );
    } else if (i == 2) {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        Number(process.env.ROUND_THIRD)
      );
    } else {
      await updateAward(
        currentRoundScores[i].awards,
        currentRoundScores[i].teamId,
        0
      );
    }
  }

  if (round == "19") {
    const teamsHalfChampionshipScore = await getAllTeamsData();
    const teamsScoreSum = teamsHalfChampionshipScore.map((team) => {
      const totalScoreSum = team.scores
        .slice(0, 19)
        .reduce((acc, score) => acc + score, 0);
      return {
        id: team.id,
        totalScoreSum,
      };
    });

    const maxScoreTeam = teamsScoreSum.reduce((maxTeam, currentTeam) => {
      return currentTeam.totalScoreSum > maxTeam.totalScoreSum
        ? currentTeam
        : maxTeam;
    });

    await updateHalfChampionshipAward(maxScoreTeam.id);
  }

  if (round == "38") {
    const teamData = await getAllTeamsData();
    const teamsSecondHalfScoreSum = teamData.map((team) => {
      const totalScoreSum = team.scores
        .slice(19, 38)
        .reduce((acc, score) => acc + score, 0);
      return {
        id: team.id,
        totalScoreSum,
      };
    });

    const maxSecondHalfScoreTeam = teamsSecondHalfScoreSum.reduce(
      (maxTeam, currentTeam) => {
        return currentTeam.totalScoreSum > maxTeam.totalScoreSum
          ? currentTeam
          : maxTeam;
      }
    );

    const teamsChampionshipScoreSum = teamData.map((team) => {
      const totalScoreSum = team.scores.reduce((acc, score) => acc + score, 0);
      return {
        id: team.id,
        totalScoreSum,
      };
    });

    const maxChampionshipScoreTeam = teamsChampionshipScoreSum.reduce(
      (maxTeam, currentTeam) => {
        return currentTeam.totalScoreSum > maxTeam.totalScoreSum
          ? currentTeam
          : maxTeam;
      }
    );

    const richerTeam = teamData.reduce((richerTeam, currentTeam) => {
      return currentTeam.netWorth > richerTeam.netWorth
        ? currentTeam
        : richerTeam;
    });

    await updateSecondHalfChampionshipAward(maxSecondHalfScoreTeam.id);
    await updateChampionshipAward(maxChampionshipScoreTeam.id);
    await updateRicherAward(richerTeam.id);
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Scored successfully inserted",
    }),
  };
  return response;
}

export { handler };
