import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { NetworkLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class CitusStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { natGateways: 1 });

    const db = new rds.DatabaseCluster(this, 'DatabaseCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_6,
      }),
      instanceProps: {
        instanceType: new ec2.InstanceType('r6g.large'),
        enablePerformanceInsights: true,
        vpc,
      },
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      defaultDatabaseName: 'postgres',
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      enableFargateCapacityProviders: true,
      containerInsights: true,
      vpc,
    });

    const service = new NetworkLoadBalancedFargateService(this, 'Service', {
      cluster,
      cpu: 1024,
      memoryLimitMiB: 2048,
      taskImageOptions: {
        containerName: 'citus',
        image: ecs.ContainerImage.fromRegistry('citusdata/citus:11.2.0-pg14'),
        containerPort: 5432,
        //environment: {
        //  POSTGRES_PASSWORD: 'mypassword',
        //},
        secrets: {
          POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(db.secret!, 'password'),
          PGPASSWORD: ecs.Secret.fromSecretsManager(db.secret!, 'password'),
        },
      },
      listenerPort: 5432,
    });

    service.service.connections.allowFrom(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(5432), 'from VPC (for NLB)');
    //service.service.connections.allowFromAnyIpv4(ec2.Port.tcp(5432), 'PostgreSQL');

    db.connections.allowDefaultPortFrom(service.service, 'from Citus');

  }
}
