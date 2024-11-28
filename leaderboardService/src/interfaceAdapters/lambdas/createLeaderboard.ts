import { createController } from '../../useCases/create/index.js';
import { CreateLeaderboardDTO } from '../../repositories/ILeaderboardsRepository.js';
import { HandlerError } from '../../errors/handlerError.js';

interface Event {
  body: string;
}

const handler = async (event: Event) => {
  try {
    // Verifica se o corpo do evento está presente
    if (!event.body) {
      throw HandlerError.invalidInput();
    }

    // Tenta parsear o corpo do evento
    let data: Partial<CreateLeaderboardDTO>;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      throw HandlerError.invalidInput();
    }

    // Valida se todos os campos obrigatórios estão presentes
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

    // Chama o controlador para processar os dados
    const response = await createController.handler(data);

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
    

    // Caso contrário, trate como erro genérico
    const error = err as Error; // Type assertion
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
