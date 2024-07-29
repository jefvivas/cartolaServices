import { GetTeamsScoresProps } from "../interfaces";
import { getAllTeamsData } from "./getAllTeams";

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
        secondHalfChampionship,
        richerTeam,
        champion,
      }) => ({
        teamId: id,
        score: scores,
        award,
        cupAward,
        halfChampionship: halfChampionship || 0,
        secondHalfChampionship: secondHalfChampionship || 0,
        richerTeam: richerTeam || 0,
        netWorth: netWorth || 0,
        team_owner,
        team_name,
        champion: champion || 0,
      })
    );

    return scores;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
