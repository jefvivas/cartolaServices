import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { RoundDataProps } from "../interfaces";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function getCurrentRound(): Promise<number> {
  try {
    const getItemParams = {
      TableName: "Cartola",
      Key: marshall({ id: "RoundNumber" }),
    };

    const { Item } = await ddbClient.send(new GetItemCommand(getItemParams));
    if (!Item) throw new Error("No teams found");
    const { currentRound } = unmarshall(Item) as RoundDataProps;
    return currentRound;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
