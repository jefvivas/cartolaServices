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
  public readonly putCupAwardsLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: PutCupAwardStackProps) {
    super(scope, id, props);

    const putCupAwardLambda = new NodejsFunction(this, "PutCupAwardLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "..",
        "controllers",
        "putCupAwards.ts"
      ),
      environment: {
        TABLE_NAME: props.table.tableName,
        CUP_WINNER: process.env.CUP_WINNER as string,
        CUP_SECOND: process.env.CUP_SECOND as string,
        CUP_THIRD: process.env.CUP_THIRD as string,
      },
      timeout: Duration.seconds(10),
    });

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
    this.putCupAwardsLambdaIntegration = new LambdaIntegration(
      putCupAwardLambda
    );
  }
}
