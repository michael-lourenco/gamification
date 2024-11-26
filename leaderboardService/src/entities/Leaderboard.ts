import { uuid } from "uuidv4";

export interface PlayerData {
    uid: string | null;
    name: string | null;
    score: string | null;
    date: Date | null;
}

export class Leaderboard {
  public readonly uid: string;
  public name: string;
  public owner: string;
  public description: string;
  public leaderboard: PlayerData[];

  constructor(props: Omit<Leaderboard, 'uid'>, uid?: string) {
    Object.assign(this, props);

    if (!uid) {
      this.uid = uuid();
    }
  }
}
