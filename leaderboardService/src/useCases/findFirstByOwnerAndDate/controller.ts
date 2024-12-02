import { FindFirstByOwnerAndDateUseCase } from './useCase.js';

export class FindFirstByOwnerAndDateController {
  constructor(private findFirstByOwnerAndDateUseCase: FindFirstByOwnerAndDateUseCase) {}

  async handler({ owner, date }: { owner: string, date: Date }) {
    try {
      const response = await this.findFirstByOwnerAndDateUseCase.execute({owner, date});

      return response;
    } catch (err: unknown) {
      console.error('Error in FindFirstByOwnerAndDateController:', err);
      throw new Error('Failed to handle FindFirstByOwnerAndDateController');
    }
  }
}
