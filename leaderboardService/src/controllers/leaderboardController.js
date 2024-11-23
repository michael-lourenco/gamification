class LeaderboardController {
    constructor() {
    }

    async createLeaderboard({ leaderboardId, ...data }) {
        try {            
            console.log("[LeaderboardController] createLeaderboard");

            return {}   
        } catch (error) {
        
            console.error( "[LeaderboardController] createLeaderboard", error);
        }
    }

}

export default LeaderboardController;
