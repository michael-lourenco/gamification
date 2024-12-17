import { IParticipant } from 'entities/interfaces/IParticipant.js';
import { Leaderboard } from 'entities/Leaderboard.js';
import { RankingCriteria } from 'entities/criteria/RankingCriteria.js';

export interface ILeaderboardsRepository {
  save<T extends IParticipant>(
    leaderboard: Leaderboard<T>,
  ): Promise<Leaderboard<IParticipant>>;

  // findById<T extends IParticipant>(id: string): Promise<Leaderboard<T> | null>;

  findAllByOwner<T extends IParticipant>(
    owner: string,
  ): Promise<Leaderboard<T>[]>;

  findFirstByOwnerAndDate<T extends IParticipant>(params: {
    owner: string;
    date: Date;
  }): Promise<Leaderboard<T> | null>;

  createCriteriaInstance(identifier: string): RankingCriteria;
}
