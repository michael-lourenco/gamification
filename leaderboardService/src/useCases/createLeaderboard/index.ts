import { DynamoLeaderboardRepository } from '../../repositories/implementations/DynamoLeaderboardRepository.js';
import { CreateLeaderboardController } from './controller.js';
import { CreateLeaderboardUseCase } from './useCase.js';

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository();

export const createLeaderboardUseCase = new CreateLeaderboardUseCase(
  dynamoLeaderboardRepository,
);

export const createLeaderboardController = new CreateLeaderboardController(
  createLeaderboardUseCase,
);
