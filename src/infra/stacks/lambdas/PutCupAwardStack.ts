import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface PutCupAwardStackProps extends StackProps {
  table: ITable;
}

export class PutCupAwardStack extends Stack {
  public readonly putCupAwardLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: PutCupAwardStackProps) {
    super(scope, id, props);

    const putCupAwardLambda = new NodejsFunction(
      this,
      "PutCupAwardLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "..",
          "controllers",
          "putCupScore.ts"
        ),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: Duration.seconds(10),
      }
    );

    putCupAwardLambda.addToRolePolicy(
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
    this.putCupAwardLambdaIntegration = new LambdaIntegration(
      putCupAwardLambda
    );
  }
}
