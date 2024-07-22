import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function getTeamCupAwardsById(teamId: string): Promise<number[]> {
  try {
    const getItemParams = {
      TableName: "CartolaTable",
      Key: marshall({ id: teamId }),
      ProjectionExpression: "cupAward",
    };

    const { Item } = await ddbClient.send(new GetItemCommand(getItemParams));
    if (!Item) throw new Error("No awards found");
    const item = unmarshall(Item) as number[];
    return item;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
