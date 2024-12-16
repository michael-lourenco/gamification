// import { ILeaderboardsRepository } from 'repositories/ILeaderboardsRepository.js';
// import { Leaderboard } from 'entities/Leaderboard.js';

// export class FindFirstByOwnerAndDateUseCase {
//   constructor(private leaderboardsRepository: ILeaderboardsRepository) {}

//   async execute({
//     owner,
//     date,
//   }: {
//     owner: string;
//     date: Date;
//   }): Promise<Leaderboard | null> {
//     try {
//       const leaderboard =
//         await this.leaderboardsRepository.findFirstByOwnerAndDate({
//           owner,
//           date,
//         });

//       return leaderboard;
//     } catch (err) {
//       console.error('Error in ListUseCase:', err);
//       throw new Error('Failed to execute ListUseCase');
//     }
//   }
// }
