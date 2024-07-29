import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

export async function updateChampionshipAward(
  teamId: string
): Promise<void> {
  const updateItemParams = {
    TableName: "Cartola",
    Key: marshall({ id: teamId }),
    UpdateExpression: "SET championship = :championship",
    ExpressionAttributeValues: marshall({
      ":championship": Number(process.env.HALF_SEASON_WINNER),
    }),
  };

  try {
    await ddbClient.send(new UpdateItemCommand(updateItemParams));
    return;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
