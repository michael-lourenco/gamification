// import { UpdateLeaderboardUseCase } from 'useCases/updateLeaderboard/useCase.js';
// import { UpdateLeaderboardDTO } from 'repositories/ILeaderboardsRepository.js';

// export class UpdateLeaderboardController {
//   constructor(private updateLeaderboardUseCase: UpdateLeaderboardUseCase) {}

//   async handler(event: Partial<UpdateLeaderboardDTO>) {
//     try {
//       if (
//         !event.id ||
//         !event.name ||
//         !event.owner ||
//         !event.description ||
//         !event.leaderboard ||
//         !event.date
//       ) {
//         throw new Error('Missing required fields');
//       }

//       const leaderboardData: UpdateLeaderboardDTO = {
//         id: event.id,
//         name: event.name,
//         owner: event.owner,
//         description: event.description,
//         leaderboard: event.leaderboard,
//         date: event.date,
//       };

//       const response =
//         await this.updateLeaderboardUseCase.execute(leaderboardData);

//       return response;
//     } catch (err: unknown) {
//       console.error('Error in UpdateLeaderboardController:', err);
//       throw new Error('Failed to handle UpdateLeaderboardController');
//     }
//   }
// }
