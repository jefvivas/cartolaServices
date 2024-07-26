import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/database/DataStack";
import { UploadTeamsLambdaStack } from "./stacks/lambdas/UploadTeamsStack";
import { PutRoundScoreStack } from "./stacks/lambdas/PutRoundScoreStack";
import { GetTeamsScoresStack } from "./stacks/lambdas/GetTeamsScore";
import { GetTeamAwardsStack } from "./stacks/lambdas/GetTeamAwards";

import { ApiStack } from "./stacks/apigateway/ApiStack";
import { PutCupAwardStack } from "./stacks/lambdas/PutCupAwardStack";
import { GetTeamCupAwardsStack } from "./stacks/lambdas/GetTeamCupAwards";

import { config } from "dotenv";
import { MarketCheckerStack } from "./stacks/lambdas/MarketChecker";

config();

const app = new App();
const dataStack = new DataStack(app, "DataStack");

const uploadTeamsStack = new UploadTeamsLambdaStack(app, "UploadTeamsStack", {
  table: dataStack.cartolaTable,
});
const putRoundScoreStack = new PutRoundScoreStack(app, "PutRoundScoreStack", {
  table: dataStack.cartolaTable,
});

const getTeamsScoresStack = new GetTeamsScoresStack(
  app,
  "GetTeamsScoresStack",
  {
    table: dataStack.cartolaTable,
  }
);

const getTeamAwardsStack = new GetTeamAwardsStack(app, "GetTeamAwardsStack", {
  table: dataStack.cartolaTable,
});

const getTeamCupAwardsStack = new GetTeamCupAwardsStack(
  app,
  "GetTeamCupAwardsStack",
  {
    table: dataStack.cartolaTable,
  }
);

const putTeamCupAwardsStack = new PutCupAwardStack(app, "PutCupAwardStack", {
  table: dataStack.cartolaTable,
});

new MarketCheckerStack(app, "MarketCheckerStack", {
  table: dataStack.cartolaTable,
});

new ApiStack(app, "ApiStack", {
  uploadTeamsLambdaIntegration: uploadTeamsStack.uploadTeamsLambdaIntegration,
  putRoundScoreLambdaIntegration:
    putRoundScoreStack.putRoundScoreLambdaIntegration,
  getTeamsScoresLambdaIntegration:
    getTeamsScoresStack.getTeamsScoresLambdaIntegration,
  getTeamAwardsLambdaIntegration:
    getTeamAwardsStack.getTeamAwardsLambdaIntegration,
  putCupAwardsLambdaIntegration:
    putTeamCupAwardsStack.putCupAwardsLambdaIntegration,
  getTeamCupAwardsLambdaIntegration:
    getTeamCupAwardsStack.getTeamCupAwardsLambdaIntegration,
});
