import { IParticipant } from './IParticipant.js';

export interface IRankingStrategy<T extends IParticipant> {
  rank(participants: T[]): T[];
  getLimit(): number;
}
