import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function updateCupAward(
  teamCupAwards: number[],
  teamId: string,
  amount: number
): Promise<void> {
  const updatedAwards = [...(teamCupAwards || []), amount || 0];

  const updateItemParams = {
    TableName: "Cartola",
    Key: marshall({ id: teamId }),
    UpdateExpression: "SET cupAward = :newCupAward",
    ExpressionAttributeValues: marshall({ ":newCupAward": updatedAwards }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(updateItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
