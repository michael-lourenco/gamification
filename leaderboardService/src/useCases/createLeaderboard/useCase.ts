import {
  ILeaderboardsRepository,
  CreateLeaderboardDTO,
} from 'repositories/ILeaderboardsRepository.js';
import { Leaderboard } from 'entities/Leaderboard.js';

export class CreateLeaderboardUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute(data: CreateLeaderboardDTO): Promise<Leaderboard> {
    try {
      data.date = new Date(data.date);

      const createdLeaderboard = await this.leaderboardsRepository.create(data);

      return createdLeaderboard;
    } catch (err) {
      console.error('Error in CreateLeaderboardUseCase:', err);
      throw new Error('Failed to execute CreateLeaderboardUseCase');
    }
  }
}
