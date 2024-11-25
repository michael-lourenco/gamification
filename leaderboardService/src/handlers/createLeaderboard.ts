import LeaderboardController from '../controllers/leaderboardController.js';
import { HandlerError } from '../errors/handlerError.js';

interface Event {
  body: string;
}
const handler = async (event: Event) => {
  try {

    const data = JSON.parse(event.body);
    
    const { leaderboardId } = data

    const leaderboardController = new LeaderboardController();

    const response = await leaderboardController.createLeaderboard({leaderboardId, ...data});

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Handler Error occurred:', err.message);
      HandlerError.handledError(err);
    } else {
      console.error('An unknown error occurred');
    }
  
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export { handler };