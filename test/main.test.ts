import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CitusStack } from '../src/stack';

test('Snapshot', () => {
  const app = new App();
  const stack = new CitusStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});