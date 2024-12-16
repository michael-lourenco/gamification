import { ILeaderboardsRepository } from '../../repositories/ILeaderboardsRepository.js';
import { LeaderboardFactory } from '../../factories/LeaderboardFactory.js';
import { Leaderboard } from '../../entities/Leaderboard.js';
import { IParticipant } from '../../entities/interfaces/IParticipant.js';
import { ILeaderboardConfig } from '../../entities/interfaces/ILeaderboardConfig.js';
import { RankingCriteria } from '../../entities/criteria/RankingCriteria.js';

interface CreateLeaderboardRequest {
  name: string;
  owner: string;
  description: string;
  date: string | Date;
  participants: IParticipant[];
  config: {
    type: string;
    limit: number;
    rankingCriteria: RankingCriteria[];
  };
}

export class CreateLeaderboardUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute(
    data: CreateLeaderboardRequest,
  ): Promise<Leaderboard<IParticipant>> {
    try {
      const leaderboardConfig: ILeaderboardConfig = {
        type: LeaderboardFactory.getLeaderboardType(data.config.type),
        limit: data.config.limit,
        rankingCriteria: data.config.rankingCriteria,
      };

      const leaderboardProps = {
        name: data.name,
        owner: data.owner,
        description: data.description,
        date: new Date(data.date),
        participants: data.participants,
        rankingStrategy: LeaderboardFactory.createRankingStrategy(
          leaderboardConfig.type,
          leaderboardConfig.limit,
          leaderboardConfig.rankingCriteria,
        ),
        type: leaderboardConfig.type,
        rankingCriteria: leaderboardConfig.rankingCriteria,
      };

      const leaderboard = LeaderboardFactory.createLeaderboard<IParticipant>(
        leaderboardConfig,
        leaderboardProps,
      );

      const createdLeaderboard =
        await this.leaderboardsRepository.save(leaderboard);

      return createdLeaderboard;
    } catch (err) {
      console.error('Error in CreateLeaderboardUseCase:', err);
      throw err;
    }
  }
}
