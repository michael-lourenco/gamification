import { v4 as uuidv4 } from 'uuid';
import { IRankingStrategy } from './interfaces/IRankingStrategy.js';
import { IParticipant } from './interfaces/IParticipant.js';
import { LeaderboardType } from './types/LeaderboardType.js';
import { RankingCriteria } from './criteria/RankingCriteria.js';

export class Leaderboard<T extends IParticipant> {
  public readonly id: string;
  public name: string;
  public readonly owner: string;
  public description: string;
  public participants: T[];
  public date: Date;
  public readonly type: LeaderboardType;
  public readonly rankingCriteria: RankingCriteria[];
  public rankingStrategy: IRankingStrategy<T>;

  constructor(
    props: {
      name: string;
      owner: string;
      description: string;
      participants: T[];
      date: Date;
      rankingStrategy: IRankingStrategy<T>;
      type: LeaderboardType;
      rankingCriteria: RankingCriteria[];
    },
    id?: string,
  ) {
    if (!props.name || !props.owner) {
      throw new Error('Name and owner are required.');
    }

    this.name = props.name;
    this.owner = props.owner;
    this.description = props.description;
    this.participants = props.participants.map((p) => ({
      ...p,
      date: new Date(p.date),
    }));
    this.date = new Date(props.date);
    this.rankingStrategy = props.rankingStrategy;
    this.type = props.type;
    this.rankingCriteria = props.rankingCriteria;
    this.id = id ?? uuidv4();
  }

  getRanking(): T[] {
    return this.rankingStrategy.rank(this.participants);
  }

  getRankingStrategy(): IRankingStrategy<T> {
    return this.rankingStrategy;
  }
}
