import axios from "axios";

export async function finishRound(round: number): Promise<void> {
  try {
    await axios.get(
      ` https://da65a8cz49.execute-api.sa-east-1.amazonaws.com/prod/put-round-score?round=${round}`
    );

    return;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
