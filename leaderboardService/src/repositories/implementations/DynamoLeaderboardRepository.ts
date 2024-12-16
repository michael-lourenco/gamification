import { ILeaderboardsRepository } from '../ILeaderboardsRepository.js';
import { Leaderboard } from '../../entities/Leaderboard.js';
import { IParticipant } from '../../entities/interfaces/IParticipant.js';
import { DynamoDB } from 'aws-sdk';
import { LeaderboardFactory } from '../../factories/LeaderboardFactory.js';
import { RankingCriteria } from '../../entities/criteria/RankingCriteria.js';
import { HighestScoreCriteria } from '../../entities/criteria/HighestScoreCriteria.js';
import { PositionRankingStrategy } from '../../entities/strategies/PositionRankingStrategy.js';
import { PositionLeaderboard } from '../../entities/types/PositionLeaderboard.js';

interface DynamoLeaderboardItem {
  id: string;
  name: string;
  owner: string;
  description: string;
  typeIdentifier: string;
  criteriaIdentifiers: string[];
  limit: number;
  participants: string;
  date: string;
}

export class DynamoLeaderboardRepository implements ILeaderboardsRepository {
  private readonly dynamoDb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor(dynamoDb: DynamoDB.DocumentClient, tableName: string) {
    this.dynamoDb = dynamoDb;
    this.tableName = tableName;
  }

  async save<T extends IParticipant>(
    leaderboard: Leaderboard<T>,
  ): Promise<Leaderboard<IParticipant>> {
    const item: DynamoLeaderboardItem & { uid?: string } = {
      id: leaderboard.id,
      uid: leaderboard.id,
      name: leaderboard.name,
      owner: leaderboard.owner,
      description: leaderboard.description,
      typeIdentifier: leaderboard.type.identifier,
      criteriaIdentifiers: leaderboard.rankingCriteria.map((c) => c.identifier),
      limit: leaderboard.rankingStrategy.getLimit(),
      participants: JSON.stringify(leaderboard.participants),
      date: leaderboard.date.toISOString(),
    };

    await this.dynamoDb
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();

    return leaderboard as Leaderboard<IParticipant>;
  }

  // async findById<T extends IParticipant>(
  //   id: string,
  // ): Promise<Leaderboard<T> | null> {
  //   const result = await this.dynamoDb
  //     .query({
  //       TableName: this.tableName,
  //       KeyConditionExpression: 'PK = :pk',
  //       ExpressionAttributeValues: {
  //         ':pk': `LEADERBOARD#${id}`,
  //       },
  //     })
  //     .promise();

  //   if (!result.Items?.[0]) return null;

  //   const item = result.Items[0] as DynamoLeaderboardItem;
  //   const type = LeaderboardFactory.getLeaderboardType(item.typeIdentifier);
  //   const criteria = item.criteriaIdentifiers.map((c) =>
  //     this.createCriteriaInstance(c),
  //   );

  //   const leaderboard = new Leaderboard<T>({
  //     name: item.name,
  //     owner: item.owner,
  //     description: item.description,
  //     participants: JSON.parse(item.participants),
  //     date: new Date(item.date),
  //     type,
  //     rankingCriteria: criteria,
  //     rankingStrategy: LeaderboardFactory.createRankingStrategy(
  //       type,
  //       item.limit,
  //       criteria,
  //     ),
  //   });

  //   return LeaderboardFactory.createLeaderboard<T>(
  //     {
  //       type,
  //       limit: item.limit,
  //       rankingCriteria: criteria,
  //     },
  //     leaderboard,
  //   );
  // }

  async findAllByOwner<T extends IParticipant>(
    owner: string,
  ): Promise<Leaderboard<T>[]> {
    try {
      console.log(`4 - findAllByOwner - DynamoLeaderboardRepository`);
      const result = await this.dynamoDb
        .query({
          TableName: this.tableName,
          IndexName: 'OwnerIndex',
          KeyConditionExpression: '#owner = :owner',
          ExpressionAttributeNames: {
            '#owner': 'owner',
          },
          ExpressionAttributeValues: {
            ':owner': owner,
          },
        })
        .promise();

      if (!result.Items) return [];

      return result.Items.map((item) => {
        const leaderboardItem = item as DynamoLeaderboardItem;

        const rankingStrategy = LeaderboardFactory.createRankingStrategy(
          new PositionLeaderboard(),
          leaderboardItem.limit,
          leaderboardItem.criteriaIdentifiers.map(this.createCriteriaInstance),
        );

        return new Leaderboard<T>({
          name: leaderboardItem.name,
          owner: leaderboardItem.owner,
          description: leaderboardItem.description,
          type: new PositionLeaderboard(),
          rankingCriteria: leaderboardItem.criteriaIdentifiers.map(
            this.createCriteriaInstance,
          ),
          rankingStrategy,
          participants: JSON.parse(leaderboardItem.participants),
          date: new Date(leaderboardItem.date),
        });
      });
    } catch (err) {
      console.error('Error in findAllByOwner:', err);
      throw err;
    }
  }

  // async findFirstByOwnerAndDate(params: {
  //   owner: string;
  //   date: Date;
  // }): Promise<Leaderboard<any> | null> {
  //   const result = await this.dynamoDb
  //     .query({
  //       TableName: this.tableName,
  //       IndexName: 'GSI1',
  //       KeyConditionExpression:
  //         'GSI1PK = :gsi1pk AND begins_with(GSI1SK, :gsi1sk)',
  //       ExpressionAttributeValues: {
  //         ':gsi1pk': `OWNER#${params.owner}`,
  //         ':gsi1sk': `DATE#${params.date.toISOString().split('T')[0]}`,
  //       },
  //       Limit: 1,
  //     })
  //     .promise();

  //   if (!result.Items?.[0]) return null;

  //   const item = result.Items[0] as DynamoLeaderboardItem;
  //   return this.findById(item.id);
  // }

  public createCriteriaInstance(identifier: string): RankingCriteria {
    switch (identifier) {
      case 'HIGHEST_SCORE':
        return new HighestScoreCriteria();
      default:
        throw new Error(`Unsupported ranking criteria: ${identifier}`);
    }
  }
}
