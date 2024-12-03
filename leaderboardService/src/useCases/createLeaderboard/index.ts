import { DynamoLeaderboardRepository } from '../../repositories/implementations/DynamoLeaderboardRepository.js';
import { CreateLeaderboardController } from './controller.js';
import { CreateLeaderboardUseCase } from './useCase.js';
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT,
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
});

const tableName = process.env.DYNAMO_TABLE_LEADERBOARDS ?? `leaderboards-dev`;

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository(
  dynamoDB,
  tableName,
);

export const createLeaderboardUseCase = new CreateLeaderboardUseCase(
  dynamoLeaderboardRepository,
);

export const createLeaderboardController = new CreateLeaderboardController(
  createLeaderboardUseCase,
);
