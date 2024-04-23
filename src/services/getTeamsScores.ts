import { getAllTeamsData } from "../repository/getAllTeams";

export async function getTeamsScores() {
  try {
    const items = await getAllTeamsData();
    if (!items) throw new Error("No teams found");
    const scores = items.map(
      ({ id, scores, award, totalScore, netWorth, team_owner, team_name }) => ({
        teamId: id,
        score: scores,
        award: award || 0,
        totalScore: totalScore || 0,
        netWorth: netWorth || 0,
        team_owner,
        team_name,
      })
    );

    return scores;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
