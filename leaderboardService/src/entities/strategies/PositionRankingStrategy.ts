import { IRankingStrategy } from '../interfaces/IRankingStrategy.js';
import { PositionParticipant } from '../participants/PositionParticipant.js';
export class PositionRankingStrategy
  implements IRankingStrategy<PositionParticipant>
{
  constructor(private limit: number) {}

  rank(participants: PositionParticipant[]): PositionParticipant[] {
    return participants
      .sort((a, b) => a.position - b.position)
      .slice(0, this.limit);
  }

  getLimit(): number {
    return this.limit;
  }
}
