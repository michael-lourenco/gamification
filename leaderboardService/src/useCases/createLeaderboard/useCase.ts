import {
  ILeaderboardsRepository,
  CreateLeaderboardDTO,
} from 'repositories/ILeaderboardsRepository.js';
import { Leaderboard } from 'entities/Leaderboard.js';

export class CreateUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute(data: CreateLeaderboardDTO): Promise<Leaderboard> {
    try {
      let dateFix = data.date ? new Date(data.date) : null;

      data.date = dateFix;

      const createdLeaderboard = await this.leaderboardsRepository.create(data);

      return createdLeaderboard;
    } catch (err) {
      console.error('Error in CreateUseCase:', err);
      throw new Error('Failed to execute CreateUseCase');
    }
  }
}
