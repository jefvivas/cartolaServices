import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  uploadTeamsLambdaIntegration: LambdaIntegration;
  putRoundScoreLambdaIntegration: LambdaIntegration;
  getTeamsScoresLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "CartolaApi");

    const uploadTeamsResource = api.root.addResource("upload-teams");
    uploadTeamsResource.addMethod("POST", props.uploadTeamsLambdaIntegration);

    const putRoundScoreResource = api.root.addResource("put-round-score");
    putRoundScoreResource.addMethod(
      "GET",
      props.putRoundScoreLambdaIntegration
    );

    const getTeamsScoresResource = api.root.addResource("get-teams-scores");
    getTeamsScoresResource.addMethod(
      "GET",
      props.getTeamsScoresLambdaIntegration
    );
  }
}
