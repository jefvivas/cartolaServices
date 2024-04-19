import { getAllTeams } from "../repository/getAllTeams";

export async function getTeamsTotalScore() {
  try {
    const items = await getAllTeams();
    if (!items) throw new Error("No teams found");

    const scores = items.map((item) => ({
      teamId: item.id,
      score: item.scores,
    }));

    return scores;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
