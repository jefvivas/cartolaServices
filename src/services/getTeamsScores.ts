import { getAllTeams } from "../repository/getAllTeams";

export async function getTeamsScores() {
  try {
    const items = await getAllTeams();
    if (!items) throw new Error("No teams found");
    const scores = items.map((item) => ({
      teamId: item.id,
      score: item.scores,
      award: item.award,
    }));

    return scores;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
