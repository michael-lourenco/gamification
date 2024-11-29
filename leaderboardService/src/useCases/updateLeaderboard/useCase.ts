import {
  ILeaderboardsRepository,
  UpdateLeaderboardDTO,
} from 'repositories/ILeaderboardsRepository.js';
import { Leaderboard } from 'entities/Leaderboard.js';

export class UpdateLeaderboardUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute(data: UpdateLeaderboardDTO): Promise<Leaderboard> {
    try {
      let dateFix = data.date ? new Date(data.date) : null;

      data.date = dateFix;

      const updatedLeaderboard = await this.leaderboardsRepository.update(data);

      return updatedLeaderboard;
    } catch (err) {
      console.error('Error in UpdateLeaderboardUseCase:', err);
      throw new Error('Failed to execute UpdateLeaderboardUseCase');
    }
  }
}
