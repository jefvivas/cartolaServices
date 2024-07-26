import { getCurrentRound } from "../services/getCurrentRound";
import { updateCurrentRound } from "../services/updateCurrentRound";
import { finishRound } from "../utils/axios/finishRound";
import { getOfficialCurrentRound } from "../utils/axios/getOfficialCurrentRound";

async function handler() {
  const officialCurrentRound = await getOfficialCurrentRound();
  const appCurrentRound = await getCurrentRound();

  if (officialCurrentRound !== appCurrentRound) {
    await finishRound(officialCurrentRound);
    await updateCurrentRound(officialCurrentRound);
  }
}

export { handler };
