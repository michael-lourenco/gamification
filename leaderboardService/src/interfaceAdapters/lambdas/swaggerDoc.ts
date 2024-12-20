import * as fs from 'fs';
import * as path from 'path';
import YAML from 'yaml'; // Alterado para usar o pacote 'yaml'
import { HandlerError } from '../../errors/handlerError.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CustomEvent {
  headers: {
    [key: string]: string | undefined;
  };
  path?: string;
  httpMethod?: string;
  [key: string]: any;
}

const handler = async (event: CustomEvent) => {
  try {
    // Verificar se a requisição possui headers
    if (!event.headers) {
      throw HandlerError.invalidInput();
    }

    // Caminho do arquivo YAML
    const filePath = path.join(__dirname, '../../swagger/leaderboard-api.yaml');

    console.log('FILE PATH ::::::::::::::: ', filePath);

    // Validar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      throw HandlerError.default(new Error('Swagger file not found.'));
    }

    // Carregar e converter o YAML em JSON
    const yamlFile = fs.readFileSync(filePath, 'utf8');
    const swaggerDocument = YAML.parse(yamlFile);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swaggerDocument),
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
