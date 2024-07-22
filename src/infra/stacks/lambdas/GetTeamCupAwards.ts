import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface GetTeamCupAwardsStackProps extends StackProps {
  table: ITable;
}

export class GetTeamCupAwardsStack extends Stack {
  public readonly getTeamCupAwardsLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: GetTeamCupAwardsStackProps) {
    super(scope, id, props);

    const getTeamCupAwardsLambda = new NodejsFunction(
      this,
      "GetTeamAwardsCupLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "..",
          "controllers",
          "getTeamCupAwards.ts"
        ),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: Duration.seconds(10),
      }
    );

    getTeamCupAwardsLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:GetItem"],
        resources: [props.table.tableArn],
      })
    );
    this.getTeamCupAwardsLambdaIntegration = new LambdaIntegration(
      getTeamCupAwardsLambda
    );
  }
}
