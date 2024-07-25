import { GetTeamsScoresProps } from "../interfaces";
import { getAllTeamsData } from "../repository/getAllTeams";

export async function getTeamsScores(): Promise<GetTeamsScoresProps[]> {
  try {
    const items = await getAllTeamsData();
    if (!items) throw new Error("No teams found");
    const scores = items.map(
      ({
        id,
        scores,
        award,

        netWorth,
        team_owner,
        team_name,
        cupAward,
        halfChampionship,
      }) => ({
        teamId: id,
        score: scores,
        award,
        cupAward,
        halfChampionship: halfChampionship || 0,
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
