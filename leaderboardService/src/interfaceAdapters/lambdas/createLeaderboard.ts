import { createController } from '../../useCases/create/index.js';
import { CreateLeaderboardDTO } from '../../repositories/ILeaderboardsRepository.js';

interface Event {
  body: string;
}

const handler = async (event: Event) => {
  try {
    if (!event.body) {
      throw new Error('Event body is missing');
    }

    let data: Partial<CreateLeaderboardDTO> = JSON.parse(event.body);

    if (
      !data.id ||
      !data.name ||
      !data.owner ||
      !data.description ||
      !data.leaderboard ||
      !data.date
    ) {
      throw new Error('Missing required fields in the event body');
    }

    const response = await createController.handler(data);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err: unknown) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export { handler };
