import { LeaderboardType } from '../types/LeaderboardType.js';
import { RankingCriteria } from '../criteria/RankingCriteria.js';

export interface ILeaderboardConfig {
  limit: number;
  type: LeaderboardType;
  rankingCriteria: RankingCriteria[];
}
