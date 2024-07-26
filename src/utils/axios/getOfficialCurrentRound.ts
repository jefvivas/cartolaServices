import axios from "axios";

export async function getOfficialCurrentRound(): Promise<number> {
  try {
    const response = await axios.get(
      `https://api.cartola.globo.com/mercado/status`
    );

    const currentRound = Number(response.data.rodada_atual);

    return currentRound;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
