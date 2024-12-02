import { DynamoLeaderboardRepository } from '../../repositories/implementations/DynamoLeaderboardRepository.js';
import { FindFirstByOwnerAndDateController } from './controller.js';
import { FindFirstByOwnerAndDateUseCase } from './useCase.js';
import AWS from 'aws-sdk';

const dynamoDB=  new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT,
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
});

const tableName = process.env.DYNAMO_TABLE_LEADERBOARDS ?? `leaderboards-dev`;

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository(
  dynamoDB,
  tableName
);

export const findFirstByOwnerAndDateUseCase = new FindFirstByOwnerAndDateUseCase(
  dynamoLeaderboardRepository,
);

export const findFirstByOwnerAndDateController = new FindFirstByOwnerAndDateController(
  findFirstByOwnerAndDateUseCase,
);
