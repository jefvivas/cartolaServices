import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface GetTeamsScoresStackProps extends StackProps {
  table: ITable;
}

export class GetTeamAwardsStack extends Stack {
  public readonly getTeamAwardsLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: GetTeamsScoresStackProps) {
    super(scope, id, props);

    const getTeamAwardsLambda = new NodejsFunction(
      this,
      "GetTeamAwardsLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "..",
          "controllers",
          "getTeamAwards.ts"
        ),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: Duration.seconds(10),
      }
    );

    getTeamAwardsLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:GetItem"],
        resources: [props.table.tableArn],
      })
    );
    this.getTeamAwardsLambdaIntegration = new LambdaIntegration(
      getTeamAwardsLambda
    );
  }
}
