import { ILeaderboardsRepository } from 'repositories/ILeaderboardsRepository.js';
import { Leaderboard } from 'entities/Leaderboard.js';

export class FindFirstByOwnerDateAndTypeUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute({
    owner,
    date,
    type,
  }: {
    owner: string;
    date: Date;
    type: string;
  }): Promise<Leaderboard | null> {
    try {
      const leaderboard =
        await this.leaderboardsRepository.findFirstByOwnerDateAndType({
          owner,
          date,
          type,
        });

      return leaderboard;
    } catch (err) {
      console.error('Error in FindFirstByOwnerDateAndTypeUseCase:', err);
      throw new Error('Failed to execute FindFirstByOwnerDateAndTypeUseCase');
    }
  }
}
