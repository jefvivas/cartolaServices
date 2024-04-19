import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function putNewScore(
  scores: string[],
  roundScore: number,
  teamId: string
) {
  const updatedScores = [...(scores || []), roundScore || 0];

  const updateItemParams = {
    TableName: "CartolaTable",
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
