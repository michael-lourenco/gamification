import { ILeaderboardsRepository } from 'repositories/ILeaderboardsRepository.js';
import { IParticipant } from '../../entities/interfaces/IParticipant.js';
import { Leaderboard } from 'entities/Leaderboard.js';

export class FindFirstByOwnerAndDateUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute({
    owner,
    date,
  }: {
    owner: string;
    date: Date;
  }): Promise<Leaderboard<IParticipant> | null> {
    try {
      const leaderboard =
        await this.leaderboardsRepository.findFirstByOwnerAndDate({
          owner,
          date,
        });

      return leaderboard;
    } catch (err) {
      console.error('Error in ListUseCase:', err);
      throw new Error('Failed to execute ListUseCase');
    }
  }
}
