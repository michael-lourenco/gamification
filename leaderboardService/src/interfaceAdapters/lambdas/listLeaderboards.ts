import { listLeaderboardsController } from '../../useCases/listLeaderboards/index.js';
import { HandlerError } from '../../errors/handlerError.js';

type CustomEvent = {
  headers: {
    [key: string]: string | undefined;
  };
  resource?: string;
  path?: string;
  httpMethod?: string;
  [key: string]: any; // Permite propriedades adicionais
};

const handler = async (event: CustomEvent) => {
  try {
    console.log('EVENT  ::::::::::::::: ', event);

    // Tratamento para requisições OPTIONS (Preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204, // Sem conteúdo
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,x-api-key,Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      };
    }

    const apiKey = event.headers['x-api-key'];

    let owner = '';

    if (apiKey) {
      owner = apiKey.split('|')[0];
    }

    console.log('API KEY  ::::::::::::::: ', apiKey);
    console.log('OWNER ::::::::::::::: ', owner);

    const response = await listLeaderboardsController.handler({ owner });

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
