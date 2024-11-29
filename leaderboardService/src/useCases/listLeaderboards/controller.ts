import { ListLeaderboardsUseCase } from './useCase.js';

export class ListLeaderboardsController {
  constructor(private listLeaderboardsUseCase: ListLeaderboardsUseCase) {}

  async handler() {
    try {
      const response = await this.listLeaderboardsUseCase.execute();

      return response;
    } catch (err: unknown) {
      console.error('Error in ListController:', err);
      throw new Error('Failed to handle ListController');
    }
  }
}
