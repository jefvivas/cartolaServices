import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { getTeamsIds } from "../services/getTeamsIds";
import { updateCupAward } from "../repository/updateCupAward";
import { getItemsById } from "../repository/getItemsById";
import { getTeamCupAwardsById } from "../repository/getTeamCupAwards";

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { body } = event;

  if (!body) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Body is undefined",
      }),
    };
    return response;
  }
  const parsedBody = JSON.parse(body);

  if (!parsedBody) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "parsedBody is undefined",
      }),
    };
    return response;
  }

  const { firstTeam, secondTeam, thirdTeam } = parsedBody;

  if (!firstTeam || !secondTeam || !thirdTeam) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "firstTeam or secondTeam or ThirdTeam is undefined",
      }),
    };
    return response;
  }

  const teamsIds = await getTeamsIds();

  for (let i = 0; i < teamsIds.length; i++) {
    const teamCupAwards = await getTeamCupAwardsById(teamsIds[i]);
    console.log({ teamCupAwards });
    if (teamsIds[i] === firstTeam) {
      await updateCupAward(teamCupAwards, teamsIds[i], 25);
    } else if (teamsIds[i] === secondTeam) {
      await updateCupAward(teamCupAwards, teamsIds[i], 15);
    } else if (teamsIds[i] === thirdTeam) {
      await updateCupAward(teamCupAwards, teamsIds[i], 10);
    } else {
      await updateCupAward(teamCupAwards, teamsIds[i], 0);
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      message: "Award successfully inserted",
    }),
  };
  return response;
}

export { handler };
