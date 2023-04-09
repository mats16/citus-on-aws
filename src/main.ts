import { App } from 'aws-cdk-lib';
import { MyStack } from './stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'aurora-citus-dev', { env: devEnv });
// new MyStack(app, 'aurora-citus-prod', { env: prodEnv });

app.synth();