import { ILeaderboardsRepository } from "repositories/ILeaderboardsRepository.js";
import { Leaderboard } from "entities/Leaderboard.js";
import { uuid } from "uuidv4";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_REGION,
  endpoint: process.env.DYNAMO_ENDPOINT,
  accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
});

export class DynamoLeaderboardRepository implements ILeaderboardsRepository {
  async findAll(): Promise<Leaderboard[]> {
    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.DYNAMO_LEADERBOARD_TABLE!,
      IndexName: "uid",
      ScanIndexForward: false, 
      KeyConditionExpression:
        "#project = :project AND #created BETWEEN :start_date AND :finish_date",
      ExpressionAttributeNames: {
        "#project": "project",
        "#created": "created",
      },
      ExpressionAttributeValues: {
        ":project": "example-project", 
        ":start_date": "2023-01-01",  
        ":finish_date": "2023-12-31", 
      },
    };

    let allItems: Leaderboard[] = [];
    let queryResult;

    do {
      queryResult = await dynamoDB.query(queryParams).promise();
      allItems = allItems.concat(queryResult.Items as Leaderboard[]);

      queryParams.ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } while (queryResult.LastEvaluatedKey);

    return allItems;
  }

  async create({
    uid,
    name,
    owner,
    description,
    leaderboard,
  }: Partial<Pick<Leaderboard, "uid">> & Omit<Leaderboard, "uid">): Promise<Leaderboard> {
    console.log("[LeaderboardRepository] create");
    const newLeaderboard: Leaderboard = {
      uid: uid || uuid(),
      name,
      owner,
      description,
      leaderboard,
    };
  
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: "leaderboards-dev",
      Item: newLeaderboard,
    };
  
    await dynamoDB.put(params).promise();
  
    return newLeaderboard;
  }
  
}


// import { Leaderboard } from "entities/Leaderboard.js";
// // import { uuid } from "uuidv4";

// // dotenv.config();

// // const dynamoDB = new AWS.DynamoDB.DocumentClient({
// //   region: process.env.DYNAMO_REGION,
// //   endpoint: process.env.DYNAMO_ENDPOINT,
// //   accessKeyId: process.env.DYNAMO_ACCESS_KEY_ID,
// //   secretAccessKey: process.env.DYNAMO_SECRET_ACCESS_KEY,
// // });

// export class DynamoLeaderboardRepository {
//   async findAll(): Promise<any> {

//     return await `findall`;
//   }

//   async create({
//     id,
//     name,
//     owner,
//     description,
//     leaderboard,
//   }: Partial<Pick<Leaderboard, "id">> & Omit<Leaderboard, "id">): Promise<Leaderboard> {
//     console.log("[LeaderboardRepository] create");
//     const newLeaderboard: Leaderboard = {
//       id: id || `uuid()`,
//       name,
//       owner,
//       description,
//       leaderboard,
//     };
  
//     return newLeaderboard;
//   }
  
// }
