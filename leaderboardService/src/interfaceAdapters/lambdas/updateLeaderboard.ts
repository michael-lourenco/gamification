import { updateLeaderboardController } from '../../useCases/updateLeaderboard/index.js';
import { UpdateLeaderboardDTO } from '../../repositories/ILeaderboardsRepository.js';
import { HandlerError } from '../../errors/handlerError.js';

interface Event {
  body: string;
}

const handler = async (event: Event) => {
  try {

    if (!event.body) {
      throw HandlerError.invalidInput();
    }

    let data: Partial<UpdateLeaderboardDTO>;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      throw HandlerError.invalidInput();
    }

    const requiredFields: (keyof UpdateLeaderboardDTO)[] = [
      'id',
      'name',
      'owner',
      'description',
      'leaderboard',
      'date',
      'type',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw HandlerError.invalidInput();
      }
    }

    const response = await updateLeaderboardController.handler(data);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error(err);

    if (typeof err === 'object' && err !== null && 'message' in err) {
      const error = err as Error;
      const defaultError = HandlerError.default(error);
      return {
        statusCode: defaultError['statusCode'],
        body: JSON.stringify({
          message: defaultError.message,
          errorCode: defaultError['errorCode'],
        }),
      };
    }

    const error = err as Error;
    const defaultError = HandlerError.default(error);

    return {
      statusCode: defaultError['statusCode'],
      body: JSON.stringify({
        message: defaultError.message,
        errorCode: defaultError['errorCode'],
      }),
    };
  }
};

export { handler };
