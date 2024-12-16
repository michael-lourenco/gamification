export abstract class RankingCriteria {
  abstract get identifier(): string;
  abstract compare(a: any, b: any): number;
}
