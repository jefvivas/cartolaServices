import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

const times = [
  "18232918",
  "25851171",
  "49123882",
  "13913686",
  "14136510",
  "4861564",
  "12052409",
  "45643977",
  "25506419",
  "2645410",
  "535892",
  "11981681",
  "14727038",
  "25448128",
  "189648",
  "28923028",
];

async function handler(context: Context, event: APIGatewayProxyEvent) {
  for (let j = 0; j < times.length; j++) {
    try {
      const response = await axios.get(
        `https://api.cartola.globo.com/time/id/${times[j]}/1`
      );

      console.log(response);
      await ddbClient.send(
        new PutItemCommand({
          TableName: "CartolaTable",
          Item: {
            id: { S: times[j] },
            nome_cartola: { S: response.data.time.nome_cartola },
            nome_time: { S: response.data.time.nome },
          },
        })
      );
    } catch (error) {
      console.error(`Erro ao processar o time ${times[j]}:`, error);
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
  return response;
}

export { handler };
