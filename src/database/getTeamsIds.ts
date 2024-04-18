import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getTeamsIds() {
  const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

  const params = {
    TableName: "CartolaTable",
    ProjectionExpression: "id",
  };

  try {
    const data = await ddbClient.send(new ScanCommand(params));
    if (!data.Items) throw new Error("No teams found");

    const items = data.Items.map((item) => unmarshall(item));

    const ids = items.map((item) => item.id);

    return ids;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
