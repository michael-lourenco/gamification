import { Leaderboard, PlayerData } from 'entities/Leaderboard.js';

export interface CreateLeaderboardDTO {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: PlayerData[];
  date: Date;
  type: string;
}

export interface UpdateLeaderboardDTO {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: PlayerData[];
  date: Date;
  type: string;
}

export interface ILeaderboardsRepository {
  create(leaderboard: CreateLeaderboardDTO): Promise<Leaderboard>;
  findAll({ owner }: { owner: string }): Promise<Leaderboard[]>;
  findFirstByOwnerAndDate({
    owner,
    date,
  }: {
    owner: string;
    date: Date;
  }): Promise<Leaderboard | null>;

  findFirstByOwnerDateAndType({
    owner,
    date,
    type
  }: {
    owner: string;
    date: Date;
    type: string;
  }): Promise<Leaderboard | null>;
  update(leaderboard: UpdateLeaderboardDTO): Promise<Leaderboard>;
}
