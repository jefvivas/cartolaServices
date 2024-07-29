import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface PutRoundScoreStackProps extends StackProps {
  table: ITable;
}

export class PutRoundScoreStack extends Stack {
  public readonly putRoundScoreLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: PutRoundScoreStackProps) {
    super(scope, id, props);

    const putRoundScoreLambda = new NodejsFunction(
      this,
      "PutRoundScoreLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "..",
          "controllers",
          "putRoundScore.ts"
        ),
        environment: {
          TABLE_NAME: props.table.tableName,
          ROUND_WINNER: process.env.ROUND_WINNER as string,
          ROUND_SECOND: process.env.ROUND_SECOND as string,
          ROUND_THIRD: process.env.ROUND_THIRD as string,
          HALF_SEASON_WINNER: process.env.HALF_SEASON_WINNER as string,
          SEASON_WINNER: process.env.SEASON_WINNER as string,
          SEASON_RICHER: process.env.SEASON_RICHER as string,
        },
        timeout: Duration.seconds(10),
      }
    );

    putRoundScoreLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:GetItem",
        ],
        resources: [props.table.tableArn],
      })
    );
    this.putRoundScoreLambdaIntegration = new LambdaIntegration(
      putRoundScoreLambda
    );
  }
}
