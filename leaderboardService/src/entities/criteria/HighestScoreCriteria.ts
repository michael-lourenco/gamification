import { RankingCriteria } from './RankingCriteria.js';

export class HighestScoreCriteria extends RankingCriteria {
  get identifier(): string {
    return 'HIGHEST_SCORE';
  }

  compare(a: any, b: any): number {
    return b.score - a.score;
  }
}
