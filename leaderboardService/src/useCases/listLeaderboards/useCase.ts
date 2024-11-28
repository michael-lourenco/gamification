import {
  ILeaderboardsRepository
} from 'repositories/ILeaderboardsRepository.js';
import { Leaderboard } from 'entities/Leaderboard.js';

export class ListLeaderboardsUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute(): Promise<Leaderboard[]> {
    try {

      const listLeaderboards = await this.leaderboardsRepository.findAll();

      return listLeaderboards;
    } catch (err) {
      console.error('Error in ListUseCase:', err);
      throw new Error('Failed to execute ListUseCase');
    }
  }
}
