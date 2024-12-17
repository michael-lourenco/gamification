import { CreateLeaderboardUseCase } from 'useCases/createLeaderboard/useCase.js';
import { CreateLeaderboardDTO } from 'repositories/ILeaderboardsRepository.js';

export class CreateLeaderboardController {
  constructor(private createLeaderboardUseCase: CreateLeaderboardUseCase) {}

  async handler({ owner, data }: { owner: string;  data: Partial<CreateLeaderboardDTO>}) {
    try {
      console.log('DATA handler controller  ::::::::::::::: ', data);
      if (
        !data.id ||
        !data.name ||
        !owner ||
        !data.description ||
        !data.leaderboard ||
        !data.date
      ) {
        throw new Error('Missing required fields');
      }

      const leaderboardData: CreateLeaderboardDTO = {
        id: data.id,
        name: data.name,
        owner: owner,
        description: data.description,
        leaderboard: data.leaderboard,
        date: data.date,
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
