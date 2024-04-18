import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/database/DataStack";
import { UploadTeamsLambdaStack } from "./stacks/lambdas/UploadTeamsStack";
import { PutRoundScoreStack } from "./stacks/lambdas/PutRoundScoreStack";

import { ApiStack } from "./stacks/apigateway/ApiStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const uploadTeamsStack = new UploadTeamsLambdaStack(app, "UploadTeamsStack", {
  table: dataStack.cartolaTable,
});
const putRoundScoreStack = new PutRoundScoreStack(app, "PutRoundScoreStack", {
  table: dataStack.cartolaTable,
});
new ApiStack(app, "ApiStack", {
  uploadTeamsLambdaIntegration: uploadTeamsStack.uploadTeamsLambdaIntegration,
  putRoundScoreLambdaIntegration:
    putRoundScoreStack.putRoundScoreLambdaIntegration,
});
