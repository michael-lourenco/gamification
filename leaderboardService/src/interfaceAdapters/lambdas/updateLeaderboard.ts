import { updateLeaderboardController } from '../../useCases/updateLeaderboard/index.js';
import { HandlerError } from '../../errors/handlerError.js';
import { IParticipant } from '../../entities/interfaces/IParticipant.js';
import { RankingCriteria } from '../../entities/criteria/RankingCriteria.js';

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

    let data: {
      id: string;
      name: string;
      owner: string;
      description: string;
      date: string | Date;
      participants: IParticipant[];
      config: {
        type: string;
        limit: number;
        rankingCriteria: RankingCriteria[];
      };
    }; 
    
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      throw HandlerError.invalidInput();
    }

    // Campos obrigatórios para atualização
    const requiredFields: (keyof typeof data)[] = [
      'id',
      'name',
      'owner',
      'description',
      'date',
      'participants',
      'config',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw HandlerError.invalidInput();
      }
    }

    // Chama o controlador de atualização passando os dados necessários
    const response = await updateLeaderboardController.handler(data);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error(err);

    // Se o erro tiver uma mensagem específica, trata o erro com HandlerError
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

    // Caso contrário, retorna o erro genérico
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
