import { findFirstByOwnerAndDateController } from '../../useCases/findFirstByOwnerAndDate/index.js';
import { HandlerError } from '../../errors/handlerError.js';

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
    console.log('EVENT  ::::::::::::::: ', event);

    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers':
            'Content-Type,x-api-key,Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      };
    }

    const apiKey = event.headers['x-api-key'];

    const date = new Date(event.pathParameters.date);

    let owner = '';

    if (apiKey) {
      owner = apiKey.split('|')[0];
    }

    const response = await findFirstByOwnerAndDateController.handler({
      owner,
      date,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-api-key,Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
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
