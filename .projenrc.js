const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  projenVersion: '0.70.5',
  cdkVersion: '2.73.0',
  defaultReleaseBranch: 'main',
  name: 'aurora-citus',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  tsconfig: {
    compilerOptions: {
      noUnusedLocals: false,
      noUnusedParameters: false,
    },
  },
  depsUpgrade: false,
});
project.synth();