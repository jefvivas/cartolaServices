import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { TeamDataProps } from "../interfaces";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function getItemsById(teamId: string): Promise<TeamDataProps> {
  try {
    const getItemParams = {
      TableName: "Cartola",
      Key: marshall({ id: teamId }),
    };

    const { Item } = await ddbClient.send(new GetItemCommand(getItemParams));
    if (!Item) throw new Error("No teams found");
    const item = unmarshall(Item) as TeamDataProps;
    return item;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
