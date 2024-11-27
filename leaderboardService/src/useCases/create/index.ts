import { DynamoLeaderboardRepository } from '../../repositories/implementations/DynamoLeaderboardRepository.js';
import { CreateController } from './controller.js';
import { CreateUseCase } from './useCase.js';

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository();

export const createUseCase = new CreateUseCase(dynamoLeaderboardRepository);

export const createController = new CreateController(createUseCase);
