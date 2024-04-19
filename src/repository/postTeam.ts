import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function postTeam(
  teamId: string,
  teamOwner: string,
  teamName: string
) {
  const item = marshall({
    id: teamId,
    nome_cartola: teamOwner,
    nome_time: teamName,
  });

  await ddbClient.send(
    new PutItemCommand({
      TableName: "CartolaTable",
      Item: item,
    })
  );
}
