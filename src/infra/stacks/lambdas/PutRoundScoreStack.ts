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
          "services",
          "putRoundScore.ts"
        ),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: Duration.seconds(10),
      }
    );

    putRoundScoreLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:PutItem", "dynamodb:Scan"],
        resources: [props.table.tableArn],
      })
    );
    this.putRoundScoreLambdaIntegration = new LambdaIntegration(
      putRoundScoreLambda
    );
  }
}
