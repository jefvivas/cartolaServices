import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/database/DataStack";
import { LambdaStack } from "./stacks/lambdas/UploadTeamsStack";
import { ApiStack } from "./stacks/apigateway/ApiStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  table: dataStack.cartolaTable,
});
new ApiStack(app, "ApiStack", {
  cartolaLambdaIntegration: lambdaStack.cartolaLambdaIntegration,
});
