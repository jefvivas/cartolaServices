import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function updateAward(
  teamAward: number,
  teamId: string,
  amount: number
) {
  const newAward = teamAward + amount;

  const updateItemParams = {
    TableName: "CartolaTable",
    Key: marshall({ id: teamId }),
    UpdateExpression: "SET award = :newAward",
    ExpressionAttributeValues: marshall({ ":newAward": newAward }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(updateItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
