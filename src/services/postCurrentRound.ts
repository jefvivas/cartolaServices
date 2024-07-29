import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function postCurrentRound(): Promise<void> {
  const PutItemParams = {
    TableName: "Cartola",
    Key: marshall({ id: "RoundNumber" }),
    UpdateExpression: "SET currentRound = :currentRound",
    ExpressionAttributeValues: marshall({ ":currentRound": 1 }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(PutItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
