import { LeaderboardType } from './LeaderboardType.js';

export class PositionLeaderboard extends LeaderboardType {
  get identifier(): string {
    return 'POSITION';
  }

  getDefaultLimit(): number {
    return 3;
  }

  validateParticipants(participants: any[]): boolean {
    return participants.every(
      (p) => 'position' in p && typeof p.position === 'number',
    );
  }
}
