import { FindFirstByOwnerDateAndTypeUseCase } from './useCase.js';

export class FindFirstByOwnerDateAndTypeController {
  constructor(
    private findFirstByOwnerDateAndTypeUseCase: FindFirstByOwnerDateAndTypeUseCase,
  ) {}

  async handler({ owner, date, type }: { owner: string; date: Date; type: string }) {
    try {
      const response = await this.findFirstByOwnerDateAndTypeUseCase.execute({
        owner,
        date,
        type,
      });

      return response;
    } catch (err: unknown) {
      console.error('Error in FindFirstByOwnerDateAndTypeController:', err);
      throw new Error('Failed to handle FindFirstByOwnerDateAndTypeController');
    }
  }
}
