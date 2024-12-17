import { Leaderboard } from '../entities/Leaderboard.js';
import { LeaderboardType } from '../entities/types/LeaderboardType.js';
import { PositionLeaderboard } from '../entities/types/PositionLeaderboard.js';
import { PositionRankingStrategy } from '../entities/strategies/PositionRankingStrategy.js';
import { ILeaderboardConfig } from '../entities/interfaces/ILeaderboardConfig.js';
import { IParticipant } from '../entities/interfaces/IParticipant.js';
import { IRankingStrategy } from '../entities/interfaces/IRankingStrategy.js';
import { RankingCriteria } from '../entities/criteria/RankingCriteria.js';


export enum LeaderboardTypeEnum {
  POSITION = "POSITION",
  SCORE = "SCORE",
}


export enum RankingStrategyEnum {
  POSITION = "POSITION",
  SCORE = "SCORE",
}
export class LeaderboardFactory {
  private static readonly typeMap: Map<string, new () => LeaderboardType> =
    new Map<string, new () => LeaderboardType>([
      [LeaderboardTypeEnum.POSITION, PositionLeaderboard],
    ]);

  private static readonly strategyMap: Map<
    string,
    new (limit: number, criteria: RankingCriteria[]) => IRankingStrategy<any>
  > = new Map<
    string,
    new (limit: number, criteria: RankingCriteria[]) => IRankingStrategy<any>
  >([[RankingStrategyEnum.POSITION, PositionRankingStrategy]]);

  static createLeaderboard<T extends IParticipant>(
    config: ILeaderboardConfig,
    props: {
      name: string;
      owner: string;
      description: string;
      participants: T[];
      date: Date;
      type: LeaderboardType;
      rankingCriteria: RankingCriteria[];
    },
  ): Leaderboard<T> {
    const StrategyClass = this.strategyMap.get(config.type.identifier);
    if (!StrategyClass) {
      throw new Error(
        `Unsupported leaderboard type: ${config.type.identifier}`,
      );
    }

    const strategy = new StrategyClass(config.limit, config.rankingCriteria);

    if (!config.type.validateParticipants(props.participants)) {
      throw new Error(
        'Invalid participants for the specified leaderboard type',
      );
    }

    return new Leaderboard<T>({
      ...props,
      rankingStrategy: strategy,
    });
  }

  static createRankingStrategy(
    type: LeaderboardType,
    limit: number,
    criteria: RankingCriteria[],
  ): IRankingStrategy<any> {
    console.log(`5 - createRankingStrategy - LeaderboardFactory`);
    const StrategyClass = LeaderboardFactory.strategyMap.get(type.identifier);
    if (!StrategyClass) {
      throw new Error(`Unsupported leaderboard type: ${type.identifier}`);
    }

    return new StrategyClass(limit, criteria);
  }

  static getLeaderboardType(identifier: string): LeaderboardType {
    const TypeClass = this.typeMap.get(identifier);
    if (!TypeClass) {
      throw new Error(`Unsupported leaderboard type: ${identifier}`);
    }
    return new TypeClass();
  }
}
