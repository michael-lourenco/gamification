import {
  ILeaderboardsRepository,
  CreateLeaderboardDTO,
  UpdateLeaderboardDTO,
} from '../ILeaderboardsRepository.js';
import { Leaderboard, PlayerData } from '../../entities/Leaderboard.js';
import AWS from 'aws-sdk';

export class DynamoLeaderboardRepository implements ILeaderboardsRepository {
  constructor(
    private dynamoDB: AWS.DynamoDB.DocumentClient,
    private tableName: string,
  ) {}

  private sortLeaderboard(leaderboard: PlayerData[]): PlayerData[] {
    leaderboard.forEach((player) => {
      if (typeof player.date === 'string') {
        player.date = new Date(player.date);
      }
    });

    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.date.getTime() - b.date.getTime();
    });

    return leaderboard;
  }

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
        date: new Date(item.date),
      },
      item.uid,
    );
  }

  async findAll({
    owner,
    limit = 10,
    startKey,
  }: {
    owner: string;
    limit?: number;
    startKey?: AWS.DynamoDB.DocumentClient.Key;
  }): Promise<Leaderboard[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'OwnerIndex',
      KeyConditionExpression: '#owner = :owner',
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: { ':owner': owner },
      Limit: limit,
      ExclusiveStartKey: startKey,
    };

    let allItems: Leaderboard[] = [];
    let queryResult;

    try {
      do {
        queryResult = await this.dynamoDB.query(params).promise();
        const items = queryResult.Items?.map((item) =>
          this.fromDynamoFormat(item),
        );
        allItems = allItems.concat(items ?? []);
        params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
      } while (queryResult.LastEvaluatedKey);

      return allItems;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch leaderboard by owner and date from DynamoDB. Error: ${error.message}`,
        );
      } else {
        throw new Error(
          `Failed unknown error fetching leaderboard by owner and date from DynamoDB. Error: ${error}`,
        );
      }
    }
  }

  async create(leaderboard: Leaderboard): Promise<Leaderboard> {
    const leaderboardSorted = this.sortLeaderboard(
      leaderboard.leaderboard.map((player) => ({
        ...player,
        date:
          typeof player.date === 'string' ? new Date(player.date) : player.date,
      })),
    );

    leaderboard.leaderboard = leaderboardSorted;

    const dynamoItem = this.toDynamoFormat(leaderboard);

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: dynamoItem,
    };

    try {
      await this.dynamoDB.put(params).promise();
      return leaderboard;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch leaderboard by owner and date from DynamoDB. Error: ${error.message}`,
        );
      } else {
        throw new Error(
          `Failed unknown error fetching leaderboard by owner and date from DynamoDB. Error: ${error}`,
        );
      }
    }
  }

  async findFirstByOwnerAndDate({
    owner,
    date,
  }: {
    owner: string;
    date: Date;
  }): Promise<Leaderboard | null> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'OwnerDateIndex',
      KeyConditionExpression:
        '#owner = :owner and #date BETWEEN :startOfDay AND :endOfDay',
      ExpressionAttributeNames: {
        '#owner': 'owner',
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':owner': owner,
        ':startOfDay': startOfDay.toISOString(),
        ':endOfDay': endOfDay.toISOString(),
      },
      Limit: 1,
    };

    try {
      const queryResult = await this.dynamoDB.query(params).promise();

      if (!queryResult.Items || queryResult.Items.length === 0) {
        return null;
      }

      return this.fromDynamoFormat(queryResult.Items[0]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch leaderboard by owner and date from DynamoDB. Error: ${error.message}`,
        );
      } else {
        throw new Error(
          `Failed unknown error fetching leaderboard by owner and date from DynamoDB. Error: ${error}`,
        );
      }
    }
  }

  async update(leaderboard: Leaderboard): Promise<Leaderboard> {
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
        '#description': 'description',
        '#leaderboard': 'leaderboard',
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':name': dynamoItem.name,
        ':description': dynamoItem.description,
        ':leaderboard': dynamoItem.leaderboard,
        ':date': dynamoItem.date,
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await this.dynamoDB.update(params).promise();
      return this.fromDynamoFormat(result.Attributes);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch leaderboard by owner and date from DynamoDB. Error: ${error.message}`,
        );
      } else {
        throw new Error(
          `Failed unknown error fetching leaderboard by owner and date from DynamoDB. Error: ${error}`,
        );
      }
    }
  }
}
