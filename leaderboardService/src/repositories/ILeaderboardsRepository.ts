import { Leaderboard, PlayerData } from "entities/Leaderboard.js";


export interface CreateLeaderboardDTO {
  uid: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: PlayerData[];
}

export interface ILeaderboardsRepository {
  create(props: CreateLeaderboardDTO): Promise<Leaderboard>;
  findAll(): Promise<Leaderboard[]>;
}
