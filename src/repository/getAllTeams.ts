import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getAllTeams() {
  const ddbClient = new DynamoDBClient({ region: "sa-east-1" });

  const params = {
    TableName: "CartolaTable",
  };

  try {
    const data = await ddbClient.send(new ScanCommand(params));
    if (!data.Items) throw new Error("No teams found");

    const items = data.Items.map((item) => unmarshall(item));

    return items;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
