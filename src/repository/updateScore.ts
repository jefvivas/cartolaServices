import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function putNewScore(
  scores: number[],
  roundScore: number,
  teamId: string
): Promise<void> {
  const updatedScores = [...(scores || []), roundScore || 0];

  const updateItemParams = {
    TableName: "Cartola",
    Key: marshall({ id: teamId }),
    UpdateExpression: "SET scores = :scores",
    ExpressionAttributeValues: marshall({ ":scores": updatedScores }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(updateItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
