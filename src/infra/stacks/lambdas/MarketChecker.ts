import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { join } from "path";

interface MarketCheckerStackProps extends StackProps {
  table: ITable;
}

export class MarketCheckerStack extends Stack {
  public readonly marketCheckerLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: MarketCheckerStackProps) {
    super(scope, id, props);

    const marketCheckerLambda = new NodejsFunction(
      this,
      "MarketCheckerLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: join(__dirname, "..", "..", "..", "events", "marketChecker.ts"),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        timeout: Duration.seconds(10),
      }
    );

    marketCheckerLambda.addToRolePolicy(
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

    const rule = new Rule(this, "Rule", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "0/4",
      }),
    });

    rule.addTarget(new LambdaFunction(marketCheckerLambda));
    this.marketCheckerLambdaIntegration = new LambdaIntegration(
      marketCheckerLambda
    );
  }
}
