import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function postTeam(
  teamId: string,
  teamOwner: string,
  teamName: string
): Promise<void> {
  const item = marshall({
    id: teamId,
    team_owner: teamOwner,
    team_name: teamName,
  });

  await ddbClient.send(
    new PutItemCommand({
      TableName: "CartolaTable",
      Item: item,
    })
  );
}
