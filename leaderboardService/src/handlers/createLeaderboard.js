import LeaderboardController from '../controllers/leaderboardController.js';
import { HandlerError } from '../errors/handlerError.js';

const handler = async (event) => {
  try {
     
    const data = JSON.parse(event.body);
    
    const { leaderboardId } = data

    const leaderboardController = new LeaderboardController();

    const response = await leaderboardController.createLeaderboard({leaderboardId, ...data});

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error('Handler Error occurred:', err.message);
    HandlerError.handledError(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export { handler };