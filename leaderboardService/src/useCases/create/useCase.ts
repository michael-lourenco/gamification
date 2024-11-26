import { ILeaderboardsRepository } from "repositories/ILeaderboardsRepository";

export class CreateUseCase {
  constructor(
    private leaderboardsRepository: ILeaderboardsRepository,
  ) { }

  async execute() {
    try {
      console.log("[CreateUseCase] execute");
      const data = await this.leaderboardsRepository.create({
        uid:`teste-id`,
        name:`teste-name`,
        owner:`teste-owner`,
        description:`teste-description`,
        leaderboard:[{uid:`teste-id`,name:`teste-name`,score:`teste-score`,date:new Date("2023-11-26T15:30:00Z")}]
      });

      return data;
    } catch (err) {
      console.error('Error:', err);
    }
  };
}
