import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function getTeamAwardsById(teamId: string): Promise<string[]> {
  try {
    const getItemParams = {
      TableName: "Cartola",
      Key: marshall({ id: teamId }),
      ProjectionExpression: "award",
    };

    const { Item } = await ddbClient.send(new GetItemCommand(getItemParams));
    if (!Item) throw new Error("No awards found");
    const item = unmarshall(Item) as string[];
    return item;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
