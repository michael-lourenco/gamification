import { listLeaderboardsController } from '../../useCases/listLeaderboards/index.js';
import { HandlerError } from '../../errors/handlerError.js';

const handler = async () => {
  try {
    const response = await listLeaderboardsController.handler();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-api-key,Authorization',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Expose-Headers':
          'WWW-Authenticate,Server-Authorization',
      },
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

    // Caso contrário, trate como erro genérico
    const error = err as Error; // Type assertion
    const defaultError = HandlerError.default(error);

    return {
      statusCode: defaultError['statusCode'],
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: defaultError.message,
        errorCode: defaultError['errorCode'],
      }),
    };
  }
};

export { handler };
