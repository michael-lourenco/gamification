import { CreateLeaderboardUseCase } from 'useCases/createLeaderboard/useCase.js';
import { CreateLeaderboardDTO } from 'repositories/ILeaderboardsRepository.js';

export class CreateLeaderboardController {
  constructor(private createLeaderboardUseCase: CreateLeaderboardUseCase) {}

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

      const response =
        await this.createLeaderboardUseCase.execute(leaderboardData);

      return response;
    } catch (err: unknown) {
      console.error('Error in CreateLeaderboardController:', err);
      throw new Error('Failed to handle CreateLeaderboardController');
    }
  }
}
