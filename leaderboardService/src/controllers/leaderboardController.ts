interface CreateLeaderboardData {
    leaderboardId: string; 
    [key: string]: any;
}

class LeaderboardController {
    constructor() {
    }

    async createLeaderboard({ leaderboardId, ...data }: CreateLeaderboardData) {
        try {
            console.log("[LeaderboardController] createLeaderboard");

            return {}
        } catch (error) {
        
            console.error( "[LeaderboardController] createLeaderboard", error);
        }
    }

}

export default LeaderboardController;
