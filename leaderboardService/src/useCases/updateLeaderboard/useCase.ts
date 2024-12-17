import { ILeaderboardsRepository } from 'repositories/ILeaderboardsRepository.js';
import { LeaderboardFactory } from '../../factories/LeaderboardFactory.js';
import { Leaderboard } from 'entities/Leaderboard.js';
import { IParticipant } from 'entities/interfaces/IParticipant.js';
import { ILeaderboardConfig } from 'entities/interfaces/ILeaderboardConfig.js';
import { RankingCriteria } from 'entities/criteria/RankingCriteria.js';

export  interface UpdateLeaderboardRequest {
  id: string;
  name: string;
  owner: string;
  description: string;
  date: string | Date;
  participants: IParticipant[];
  config: {
    type: string;
    limit: number;
    rankingCriteria: RankingCriteria[];
  };
}

export class UpdateLeaderboardUseCase {
  constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

  async execute(
    data: UpdateLeaderboardRequest,
  ): Promise<Leaderboard<IParticipant>> {
    try {
      // Criação da configuração do leaderboard
      const leaderboardConfig: ILeaderboardConfig = {
        type: LeaderboardFactory.getLeaderboardType(data.config.type),
        limit: data.config.limit,
        rankingCriteria: data.config.rankingCriteria,
      };

      // Propiedades do leaderboard a serem atualizadas
      const leaderboardProps = {
        name: data.name,
        owner: data.owner,
        description: data.description,
        date: new Date(data.date), // Convertendo para Date
        participants: data.participants,
        rankingStrategy: LeaderboardFactory.createRankingStrategy(
          leaderboardConfig.type,
          leaderboardConfig.limit,
          leaderboardConfig.rankingCriteria,
        ),
        type: leaderboardConfig.type,
        rankingCriteria: leaderboardConfig.rankingCriteria,
      };

      // Criando o leaderboard atualizado
      const updatedLeaderboard = LeaderboardFactory.createLeaderboard<IParticipant>(
        leaderboardConfig,
        leaderboardProps,
      );

      // Chamando o repositório para realizar o update, passando o id e o leaderboard atualizado
      const result = await this.leaderboardsRepository.update(data.id, updatedLeaderboard);

      return result;
    } catch (err) {
      console.error('Error in UpdateLeaderboardUseCase:', err);
      throw err;
    }
  }
}
