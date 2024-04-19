import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function getItems(teamId: string) {
  try {
    const getItemParams = {
      TableName: "CartolaTable",
      Key: marshall({ id: teamId }),
    };

    const { Item } = await ddbClient.send(new GetItemCommand(getItemParams));

    if (!Item) {
      throw new Error("Team not found");
    }

    return Item;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
