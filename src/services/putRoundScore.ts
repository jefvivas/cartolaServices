import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import axios from "axios";
import { getTeamsIds } from "../database/getTeamsIds";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { putNewScore } from "../database/putNewScore";

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

    const roundScore = Number(axiosResponse.data.pontos).toFixed(2);

    const getItemParams = {
      TableName: "CartolaTable",
      Key: marshall({ id: teamsIds[i] }),
    };
    const { Item } = await ddbClient.send(new GetItemCommand(getItemParams));

    if (!Item) {
      throw new Error("Team not found");
    }
    const team = unmarshall(Item);

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
