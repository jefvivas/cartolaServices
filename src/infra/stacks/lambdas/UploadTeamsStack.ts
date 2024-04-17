import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  table: ITable;
}

export class LambdaStack extends Stack {
  public readonly cartolaLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const cartolaLambda = new NodejsFunction(this, "CartolaLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "..", "services", "putTeams.ts"),
      environment: {
        TABLE_NAME: props.table.tableName,
      },
      timeout: Duration.seconds(10),
    });

    cartolaLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:PutItem"],
        resources: [props.table.tableArn],
      })
    );
    this.cartolaLambdaIntegration = new LambdaIntegration(cartolaLambda);
  }
}
