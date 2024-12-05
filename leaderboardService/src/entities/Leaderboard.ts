import { v4 as uuidv4 } from 'uuid';

export interface PlayerData {
  id: string;
  name: string;
  score: number;
  date: Date;
}

export class Leaderboard {
  public readonly id: string;
  public name: string;
  public readonly owner: string;
  public description: string;
  public leaderboard: PlayerData[];
  public date: Date;

  constructor(props: Omit<Leaderboard, 'id'>, id?: string) {
    if (!props.name || !props.owner) {
      throw new Error('Name and owner are required.');
    }
      // Converte o objeto principal `date` em uma instância Date
      this.date = new Date(props.date);

      // Converte o array de `leaderboard` para garantir que as datas sejam instâncias de Date
      this.leaderboard = (props.leaderboard || []).map((player) => ({
        ...player,
        date: new Date(player.date), // Converte para Date
      }));
  
      Object.assign(this, props);
      this.id = id ?? uuidv4();
  }

  // addPlayer(player: PlayerData) {
  //   if (this.leaderboard.some(p => p.id === player.id)) {
  //     throw new Error('Player already exists in the leaderboard.');
  //   }
  //   this.leaderboard.push(player);
  // }

  // removePlayer(playerId: string) {
  //   this.leaderboard = this.leaderboard.filter(player => player.id !== playerId);
  // }

  // updatePlayerScore(playerId: string, score: number) {
  //   const player = this.leaderboard.find(player => player.id === playerId);
  //   if (!player) {
  //     throw new Error('Player not found.');
  //   }
  //   player.score = score;
  // }

  // getTopPlayers(limit: number): PlayerData[] {
  //   return this.leaderboard
  //     .sort((a, b) => b.score - a.score)
  //     .slice(0, limit);
  // }
}
