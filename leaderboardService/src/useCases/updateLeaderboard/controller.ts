import { UpdateLeaderboardUseCase } from 'useCases/updateLeaderboard/useCase.js';
import { UpdateLeaderboardRequest } from 'useCases/updateLeaderboard/useCase.js'; // Certifique-se de importar o tipo correto
import { IParticipant } from 'entities/interfaces/IParticipant.js';
import { RankingCriteria } from 'entities/criteria/RankingCriteria.js';

export class UpdateLeaderboardController {
  constructor(private updateLeaderboardUseCase: UpdateLeaderboardUseCase) {}

  async handler(event: Partial<UpdateLeaderboardRequest>) {
    try {
      // Validação dos campos obrigatórios
      if (
        !event.id ||
        !event.name ||
        !event.owner ||
        !event.description ||
        !event.participants ||
        !event.date ||
        !event.config
      ) {
        throw new Error('Missing required fields');
      }

      // Validação do config (que deve ter type, limit, rankingCriteria)
      if (!event.config.type || !event.config.limit || !event.config.rankingCriteria) {
        throw new Error('Missing config fields');
      }

      // Preparando os dados para o UpdateLeaderboardUseCase
      const leaderboardData: UpdateLeaderboardRequest = {
        id: event.id,
        name: event.name,
        owner: event.owner,
        description: event.description,
        date: new Date(event.date),
        participants: event.participants as IParticipant[], // Certifique-se de que `participants` seja um array de IParticipant
        config: {
          type: event.config.type,
          limit: event.config.limit,
          rankingCriteria: event.config.rankingCriteria as RankingCriteria[],
        },
      };

      // Chamando o use case para realizar o update
      const response = await this.updateLeaderboardUseCase.execute(leaderboardData);

      return response;
    } catch (err: unknown) {
      console.error('Error in UpdateLeaderboardController:', err);
      throw new Error('Failed to handle UpdateLeaderboardController');
    }
  }
}
