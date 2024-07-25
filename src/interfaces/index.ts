export interface TeamDataProps {
  id: string;
  team_name: string;
  team_owner: string;
  award: number[];
  scores: number[];
  netWorth: number;
  cupAward: number[];
  halfChampionship: number;
}

export interface GetTeamsScoresProps {
  teamId: string;
  team_name: string;
  team_owner: string;
  award: number[];
  score: number[];
  netWorth: number;
  cupAward: number[];
  halfChampionship: number;
}

export interface GetTeamInfosProps {
  nome: string;
  nome_cartola: string;
}

export interface GetTeamScoreProps {
  roundScore: number;
  netWorth: number;
}
