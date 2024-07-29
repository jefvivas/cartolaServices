import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function postCurrentRound(): Promise<void> {
  const item = marshall({
    id: "RoundNumber",
    currentRound: 1,
  });

  try {
    await ddbClient.send(
      new PutItemCommand({
        TableName: "Cartola",
        Item: item,
      })
    );
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
