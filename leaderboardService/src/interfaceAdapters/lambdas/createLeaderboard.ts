import { createLeaderboardController } from '../../useCases/createLeaderboard/index.js';
import { CreateLeaderboardDTO } from '../../repositories/ILeaderboardsRepository.js';
import { HandlerError } from '../../errors/handlerError.js';

interface Event {
  body: string;
}

type CustomEvent = {
  headers: {
    [key: string]: string | undefined;
  };
  resource?: string;
  path?: string;
  httpMethod?: string;
  [key: string]: any;
};
const handler = async (event: CustomEvent) => {
  try {
    if (!event.body) {
      throw HandlerError.invalidInput();
    }

    const apiKey = event.headers['x-api-key'];

    let owner = '';

    if (apiKey) {
      owner = apiKey.split('|')[0];
    }

    let data: Partial<CreateLeaderboardDTO>;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      throw HandlerError.invalidInput();
    }

    const requiredFields: (keyof CreateLeaderboardDTO)[] = [
      'id',
      'name',
      'owner',
      'description',
      'leaderboard',
      'date',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw HandlerError.invalidInput();
      }
    }

    const response = await createLeaderboardController.handler({ owner, data });

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
