import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

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

  const teams = parsedBody.times;

  if (!teams) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({
        message: "teams is undefined",
      }),
    };

    return response;
  }

  for (let j = 0; j < teams.length; j++) {
    try {
      const response = await axios.get(
        `https://api.cartola.globo.com/time/id/${teams[j]}/1`
      );

      await ddbClient.send(
        new PutItemCommand({
          TableName: "CartolaTable",
          Item: {
            id: { S: teams[j] },
            nome_cartola: { S: response.data.time.nome_cartola },
            nome_time: { S: response.data.time.nome },
          },
        })
      );
    } catch (error) {
      console.error(`Erro ao processar o time ${teams[j]}:`, error);
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: JSON.stringify({
      message: "Teams created successfully",
    }),
  };
  return response;
}

export { handler };
