import {
  ILeaderboardsRepository,
  CreateLeaderboardDTO,
} from '../ILeaderboardsRepository.js';
import { Leaderboard } from '../../entities/Leaderboard.js';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT,
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
});

export class DynamoLeaderboardRepository implements ILeaderboardsRepository {
  private tableName = process.env.DYNAMO_TABLE_LEADERBOARDS!;

  private toDynamoFormat(leaderboard: Leaderboard): any {
    return {
      uid: leaderboard.id,
      name: leaderboard.name,
      owner: leaderboard.owner,
      description: leaderboard.description,
      leaderboard: leaderboard.leaderboard,
      date: leaderboard.date ? leaderboard.date.toISOString() : null,
    };
  }

  private fromDynamoFormat(item: any): Leaderboard {
    return new Leaderboard(
      {
        name: item.name,
        owner: item.owner,
        description: item.description,
        leaderboard: item.leaderboard,
        date: item.date ? new Date(item.date) : null,
      },
      item.uid,
    );
  }

  async findAll(): Promise<Leaderboard[]> {
    const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
    };

    let allItems: Leaderboard[] = [];
    let scanResult;

    try {
      do {
        scanResult = await dynamoDB.scan(scanParams).promise();
        const items = scanResult.Items?.map((item) =>
          this.fromDynamoFormat(item),
        );
        allItems = allItems.concat(items ?? []);
        scanParams.ExclusiveStartKey = scanResult.LastEvaluatedKey;
      } while (scanResult.LastEvaluatedKey);

      return allItems;
    } catch (error) {
      console.error('Error scanning DynamoDB:', error);
      throw new Error('Failed to fetch leaderboards from DynamoDB.');
    }
  }

  async create(leaderboard: CreateLeaderboardDTO): Promise<Leaderboard> {
    const dynamoItem = this.toDynamoFormat(leaderboard);

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: dynamoItem,
    };

    await dynamoDB.put(params).promise();

    return leaderboard;
  }
}
