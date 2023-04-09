import { App } from 'aws-cdk-lib';
import { CitusStack } from './stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new CitusStack(app, 'Citus', { env: devEnv });
// new MyStack(app, 'aurora-citus-prod', { env: prodEnv });

app.synth();