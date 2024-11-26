import { CreateUseCase } from "useCases/create/useCase";
// import { HandlerError } from '../../errors/handlerError';
interface Event {
  body: string;
}
export class CreateController {
  
  constructor(
    private createUseCase: CreateUseCase
  ) { }


  async handler(event: Event) {
    const body = JSON.parse(event.body || '{}');


    try {
      const data = await this.createUseCase.execute();

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Handler Error occurred:', err.message);
        // HandlerError.handledError(err);
      } else {
        console.error('An unknown error occurred');
      }
    
      return {
        statusCode: 500,
        body: JSON.stringify({ message: err }),
      };
    }
  }
}



