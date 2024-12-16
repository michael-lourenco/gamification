import { ILeaderboardsRepository } from 'repositories/ILeaderboardsRepository.js';
import { Leaderboard } from 'entities/Leaderboard.js';
import { IParticipant } from 'entities/interfaces/IParticipant.js';

export class ListLeaderboardsUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute({
    owner,
  }: {
    owner: string;
  }): Promise<Leaderboard<IParticipant>[]> {
    try {
      console.log(`3 - execute - ListLeaderboardsUseCase`);
      const listLeaderboards =
        await this.leaderboardsRepository.findAllByOwner<IParticipant>(owner);

      return listLeaderboards;
    } catch (err) {
      console.error('Error in ListUseCase:', err);
      throw new Error('Failed to execute ListUseCase');
    }
  }
}
