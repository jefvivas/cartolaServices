export interface TeamDataProps {
  id: string;
  team_name: string;
  team_owner: string;
  award: number[];
  scores: number[];
  netWorth: number;
  cupAward: number[];
  halfChampionship: number;
  secondHalfChampionship: number;
  richerTeam: number;
  champion: number;
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
  secondHalfChampionship: number;
  richerTeam: number;
  champion: number;
}

export interface GetTeamInfosProps {
  nome: string;
  nome_cartola: string;
}

export interface GetTeamScoreProps {
  roundScore: number;
  netWorth: number;
}

export interface RoundDataProps {
  id: string;
  currentRound: number;
}
