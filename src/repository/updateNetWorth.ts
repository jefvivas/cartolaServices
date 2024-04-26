import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function updateNetWorth(
  teamId: string,
  netWorth: number
): Promise<void> {
  const updateItemParams = {
    TableName: "CartolaTable",
    Key: marshall({ id: teamId }),
    UpdateExpression: "SET netWorth = :netWorth",
    ExpressionAttributeValues: marshall({ ":netWorth": netWorth }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(updateItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
