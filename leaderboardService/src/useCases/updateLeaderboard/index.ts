import { DynamoLeaderboardRepository } from '../../repositories/implementations/DynamoLeaderboardRepository.js';
import { UpdateLeaderboardController } from './controller.js';
import { UpdateLeaderboardUseCase } from './useCase.js';

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository();

export const updateLeaderboardUseCase = new UpdateLeaderboardUseCase(
  dynamoLeaderboardRepository,
);

export const updateLeaderboardController = new UpdateLeaderboardController(
  updateLeaderboardUseCase,
);
