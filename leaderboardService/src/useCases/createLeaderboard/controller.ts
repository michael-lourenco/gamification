import { CreateLeaderboardUseCase } from './useCase.js';
import { IParticipant } from '../../entities/interfaces/IParticipant.js';
import { RankingCriteria } from '../../entities/criteria/RankingCriteria.js';

export class CreateLeaderboardController {
  constructor(private createLeaderboardUseCase: CreateLeaderboardUseCase) {}

  async handler({
    owner,
    data,
  }: {
    owner: string;
    data: {
      name?: string;
      description?: string;
      date?: string | Date;
      participants?: IParticipant[];
      config?: {
        type: string;
        limit: number;
        rankingCriteria: RankingCriteria[];
      };
    };
  }) {
    try {
      console.log('DATA handler controller ::::::::::::::: ', data);

      if (
        !data.name ||
        !owner ||
        !data.description ||
        !data.date ||
        !data.participants ||
        !data.config
      ) {
        throw new Error('Missing required fields');
      }

      const leaderboardData = {
        name: data.name,
        owner,
        description: data.description,
        date: data.date,
        participants: data.participants,
        config: data.config,
      };

      const response =
        await this.createLeaderboardUseCase.execute(leaderboardData);

      return response;
    } catch (err: unknown) {
      console.error('Error in CreateLeaderboardController:', err);
      throw new Error('Failed to handle CreateLeaderboardController');
    }
  }
}
