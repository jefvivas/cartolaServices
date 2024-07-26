import { getTeamAwardsById } from "./getTeamAwardsById";

export async function getTeamAwards(teamId: string): Promise<string[]> {
  try {
    const item = await getTeamAwardsById(teamId);
    if (!item) throw new Error("No team found");

    return item;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
