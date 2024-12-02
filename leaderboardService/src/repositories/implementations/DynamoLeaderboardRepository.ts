import {
  ILeaderboardsRepository,
  CreateLeaderboardDTO,
  UpdateLeaderboardDTO,
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

  async findAll({ owner }: { owner: string }): Promise<Leaderboard[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'OwnerIndex',
      KeyConditionExpression: '#owner = :owner',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':owner': owner,
      },
    };
  
    let allItems: Leaderboard[] = [];
    let queryResult;
  
    try {
      do {
        queryResult = await dynamoDB.query(params).promise();
        const items = queryResult.Items?.map((item) =>
          this.fromDynamoFormat(item),
        );
        allItems = allItems.concat(items ?? []);
        params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
      } while (queryResult.LastEvaluatedKey);
  
      return allItems;
    } catch (error) {
      console.error('Error querying DynamoDB:', error);
      throw new Error('Failed to fetch leaderboards by owner from DynamoDB.');
    }
  }
  
  async create(leaderboardDTO: CreateLeaderboardDTO): Promise<Leaderboard> {
    const leaderboard = new Leaderboard({
      name: leaderboardDTO.name,
      owner: leaderboardDTO.owner,
      description: leaderboardDTO.description,
      leaderboard: leaderboardDTO.leaderboard,
      date: leaderboardDTO.date,
    });

    const dynamoItem = this.toDynamoFormat(leaderboard);

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: dynamoItem,
    };

    await dynamoDB.put(params).promise();

    return leaderboard;
  }
  async update(leaderboard: UpdateLeaderboardDTO): Promise<Leaderboard> {
    const dynamoItem = this.toDynamoFormat(leaderboard);

    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: {
        uid: leaderboard.id,
      },
      UpdateExpression:
        'set #name = :name, #description = :description, #leaderboard = :leaderboard, #date = :date',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#owner': 'owner',
        '#description': 'description',
        '#leaderboard': 'leaderboard',
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':name': dynamoItem.name,
        ':owner': dynamoItem.owner,
        ':description': dynamoItem.description,
        ':leaderboard': dynamoItem.leaderboard,
        ':date': dynamoItem.date,
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await dynamoDB.update(params).promise();
      return this.fromDynamoFormat(result.Attributes);
    } catch (error) {
      console.error('Error updating leaderboard in DynamoDB:', error);
      throw new Error('Failed to update leaderboard in DynamoDB.');
    }
  }
}
