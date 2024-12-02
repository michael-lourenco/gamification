import { Leaderboard, PlayerData } from 'entities/Leaderboard.js';

export interface CreateLeaderboardDTO {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: PlayerData[];
  date: Date | null;
}

export interface UpdateLeaderboardDTO {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: PlayerData[];
  date: Date | null;
}

export interface ILeaderboardsRepository {
  create(leaderboard: CreateLeaderboardDTO): Promise<Leaderboard>;
  findAll({ owner }: { owner: string }): Promise<Leaderboard[]>;
  update(leaderboard: UpdateLeaderboardDTO): Promise<Leaderboard>;
}
