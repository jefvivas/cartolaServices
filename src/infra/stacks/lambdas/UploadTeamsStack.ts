import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface UploadTeamsStackProps extends StackProps {
  table: ITable;
}

export class UploadTeamsLambdaStack extends Stack {
  public readonly uploadTeamsLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: UploadTeamsStackProps) {
    super(scope, id, props);

    const uploadTeamsLambda = new NodejsFunction(this, "UploadTeamsLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "..", "services", "putTeams.ts"),
      environment: {
        TABLE_NAME: props.table.tableName,
      },
      timeout: Duration.seconds(10),
    });

    uploadTeamsLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:PutItem"],
        resources: [props.table.tableArn],
      })
    );
    this.uploadTeamsLambdaIntegration = new LambdaIntegration(
      uploadTeamsLambda
    );
  }
}
