import axios from "axios";
import { GetTeamScoreProps } from "../../interfaces";

export async function getTeamScore(
  teamId: string,
  round: string
): Promise<GetTeamScoreProps> {
  try {
    const response = await axios.get(
      `https://api.cartola.globo.com/time/id/${teamId}/${round}`
    );

    const roundScoreResponse = parseFloat(response.data.pontos);
    const roundScore = Math.round(roundScoreResponse * 100) / 100;

    const netWorth = Number(response.data.patrimonio);

    return { roundScore, netWorth };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
