import { DynamoLeaderboardRepository } from "../../repositories/implementations/DynamoLeaderboardRepository.js";
import { CreateController } from "./controller.js";
import { CreateUseCase } from "./useCase.js";

const dynamoLeaderboardRepository = new DynamoLeaderboardRepository();

const createUseCase = new CreateUseCase(
  dynamoLeaderboardRepository,
);

const createController = new CreateController(createUseCase);

export const handler = async (event: any) => {
  return await createController.handler(event);
};

export { createUseCase, createController }
