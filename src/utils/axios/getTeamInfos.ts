import axios from "axios";
import { GetTeamInfosProps } from "../../interfaces";

export async function getTeamInfos(teamId: string): Promise<GetTeamInfosProps> {
  try {
    const response = await axios.get(
      `https://api.cartola.globo.com/time/id/${teamId}/1`
    );

    const { nome_cartola, nome } = response.data.time;

    return { nome_cartola, nome };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
