export abstract class LeaderboardType {
  abstract get identifier(): string;
  abstract getDefaultLimit(): number;
  abstract validateParticipants(participants: any[]): boolean;
}
