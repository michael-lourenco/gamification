import { CreateUseCase } from 'useCases/createLeaderboard/useCase.js';
import { CreateLeaderboardDTO } from 'repositories/ILeaderboardsRepository.js';

export class CreateController {
  constructor(private createUseCase: CreateUseCase) {}

  async handler(event: Partial<CreateLeaderboardDTO>) {
    try {
      if (
        !event.id ||
        !event.name ||
        !event.owner ||
        !event.description ||
        !event.leaderboard ||
        !event.date
      ) {
        throw new Error('Missing required fields');
      }

      const leaderboardData: CreateLeaderboardDTO = {
        id: event.id,
        name: event.name,
        owner: event.owner,
        description: event.description,
        leaderboard: event.leaderboard,
        date: event.date,
      };

      const response = await this.createUseCase.execute(leaderboardData);

      return response;
    } catch (err: unknown) {
      console.error('Error in CreateController:', err);
      throw new Error('Failed to handle CreateController');
    }
  }
}
