import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function updateCurrentRound(
  newCurrentRound: number
): Promise<void> {
  const updateItemParams = {
    TableName: "Cartola",
    Key: marshall({ id: "RoundNumber" }),
    UpdateExpression: "SET currentRound = :currentRound",
    ExpressionAttributeValues: marshall({ ":currentRound": newCurrentRound }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(updateItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
