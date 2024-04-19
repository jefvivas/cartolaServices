import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getAllTeams } from "../repository/getAllTeams";

export async function getTeamsIds() {
  try {
    const items = await getAllTeams();
    if (!items) throw new Error("No teams found");

    const ids = items.map((item) => item.id);

    return ids;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
