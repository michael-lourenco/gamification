import { v4 as uuidv4 } from 'uuid';

export interface PlayerData {
  if: string;
  name: string;
  score: number;
  date: Date | null;
}

export class Leaderboard {
  public readonly id: string;
  public name: string;
  public owner: string;
  public description: string;
  public leaderboard: PlayerData[];
  public date: Date | null;

  constructor(props: Omit<Leaderboard, 'id'>, id?: string) {
    Object.assign(this, props);
    this.id = id ?? uuidv4();
    this.date = props.date ? new Date(props.date) : null;
  }
}
