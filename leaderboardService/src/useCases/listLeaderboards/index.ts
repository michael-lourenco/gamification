import { DynamoLeaderboardRepository } from '../../repositories/implementations/DynamoLeaderboardRepository.js';
import { ListLeaderboardsController } from './controller.js';
import { ListLeaderboardsUseCase } from './useCase.js';

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository();

export const listLeaderboardsUseCase = new ListLeaderboardsUseCase(
  dynamoLeaderboardRepository,
);

export const listLeaderboardsController = new ListLeaderboardsController(
  listLeaderboardsUseCase,
);
