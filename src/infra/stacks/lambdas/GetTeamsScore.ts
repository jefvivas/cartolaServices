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

export class GetTeamsScoresStack extends Stack {
  public readonly getTeamsScoresLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: GetTeamsScoresStackProps) {
    super(scope, id, props);

    const getTeamsScoresLambda = new NodejsFunction(
      this,
      "GetTeamsScoresLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "..",
          "controllers",
          "getTeamsScores.ts"
        ),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: Duration.seconds(10),
      }
    );

    getTeamsScoresLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:Scan"],
        resources: [props.table.tableArn],
      })
    );
    this.getTeamsScoresLambdaIntegration = new LambdaIntegration(
      getTeamsScoresLambda
    );
  }
}
