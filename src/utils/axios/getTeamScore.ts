import axios from "axios";

export async function getTeamScore(teamId: string, round: string) {
  try {
    const response = await axios.get(
      `https://api.cartola.globo.com/time/id/${teamId}/${round}`
    );

    const roundScoreResponse = parseFloat(response.data.pontos);
    const roundScore = Math.round(roundScoreResponse * 100) / 100;

    return roundScore;
  } catch (e) {
    console.log(e);
    throw e;
  }
}