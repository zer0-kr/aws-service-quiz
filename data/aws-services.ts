import { AwsService } from "@/types";

export const awsServices: AwsService[] = [
  // ===== DIFFICULTY 1 (Easy) - 20 services =====
  { id: "ec2", name: "Amazon EC2", iconFile: "AmazonEC2.svg", difficulty: 1, category: "compute" },
  { id: "s3", name: "Amazon S3", iconFile: "AmazonSimpleStorageService.svg", difficulty: 1, category: "storage" },
  { id: "lambda", name: "AWS Lambda", iconFile: "AWSLambda.svg", difficulty: 1, category: "compute" },
  { id: "rds", name: "Amazon RDS", iconFile: "AmazonRDS.svg", difficulty: 1, category: "database" },
  { id: "dynamodb", name: "Amazon DynamoDB", iconFile: "AmazonDynamoDB.svg", difficulty: 1, category: "database" },
  { id: "cloudfront", name: "Amazon CloudFront", iconFile: "AmazonCloudFront.svg", difficulty: 1, category: "networking" },
  { id: "vpc", name: "Amazon VPC", iconFile: "AmazonVirtualPrivateCloud.svg", difficulty: 1, category: "networking" },
  { id: "route53", name: "Amazon Route 53", iconFile: "AmazonRoute53.svg", difficulty: 1, category: "networking" },
  { id: "iam", name: "AWS IAM", iconFile: "AWSIdentityandAccessManagement.svg", difficulty: 1, category: "security" },
  { id: "cloudwatch", name: "Amazon CloudWatch", iconFile: "AmazonCloudWatch.svg", difficulty: 1, category: "management" },
  { id: "sns", name: "Amazon SNS", iconFile: "AmazonSimpleNotificationService.svg", difficulty: 1, category: "integration" },
  { id: "sqs", name: "Amazon SQS", iconFile: "AmazonSimpleQueueService.svg", difficulty: 1, category: "integration" },
  { id: "ecs", name: "Amazon ECS", iconFile: "AmazonElasticContainerService.svg", difficulty: 1, category: "compute" },
  { id: "cloudformation", name: "AWS CloudFormation", iconFile: "AWSCloudFormation.svg", difficulty: 1, category: "management" },
  { id: "ebs", name: "Amazon EBS", iconFile: "AmazonElasticBlockStore.svg", difficulty: 1, category: "storage" },
  { id: "eks", name: "Amazon EKS", iconFile: "AmazonElasticKubernetesService.svg", difficulty: 1, category: "compute" },
  { id: "api-gateway", name: "Amazon API Gateway", iconFile: "AmazonAPIGateway.svg", difficulty: 1, category: "networking" },
  { id: "elb", name: "Elastic Load Balancing", iconFile: "ElasticLoadBalancing.svg", difficulty: 1, category: "networking" },
  { id: "ecr", name: "Amazon ECR", iconFile: "AmazonElasticContainerRegistry.svg", difficulty: 1, category: "compute" },
  { id: "sagemaker", name: "Amazon SageMaker", iconFile: "AmazonSageMaker.svg", difficulty: 1, category: "ml-ai" },

  // ===== DIFFICULTY 2 (Easy-Medium) - 20 services =====
  { id: "elastic-beanstalk", name: "AWS Elastic Beanstalk", iconFile: "AWSElasticBeanstalk.svg", difficulty: 2, category: "compute" },
  { id: "codepipeline", name: "AWS CodePipeline", iconFile: "AWSCodePipeline.svg", difficulty: 2, category: "developer-tools" },
  { id: "codebuild", name: "AWS CodeBuild", iconFile: "AWSCodeBuild.svg", difficulty: 2, category: "developer-tools" },
  { id: "codedeploy", name: "AWS CodeDeploy", iconFile: "AWSCodeDeploy.svg", difficulty: 2, category: "developer-tools" },
  { id: "kinesis", name: "Amazon Kinesis", iconFile: "AmazonKinesis.svg", difficulty: 2, category: "analytics" },
  { id: "redshift", name: "Amazon Redshift", iconFile: "AmazonRedshift.svg", difficulty: 2, category: "analytics" },
  { id: "elasticache", name: "Amazon ElastiCache", iconFile: "AmazonElastiCache.svg", difficulty: 2, category: "database" },
  { id: "step-functions", name: "AWS Step Functions", iconFile: "AWSStepFunctions.svg", difficulty: 2, category: "integration" },
  { id: "cognito", name: "Amazon Cognito", iconFile: "AmazonCognito.svg", difficulty: 2, category: "security" },
  { id: "secrets-manager", name: "AWS Secrets Manager", iconFile: "AWSSecretsManager.svg", difficulty: 2, category: "security" },
  { id: "aurora", name: "Amazon Aurora", iconFile: "AmazonAurora.svg", difficulty: 2, category: "database" },
  { id: "waf", name: "AWS WAF", iconFile: "AWSWAF.svg", difficulty: 2, category: "security" },
  { id: "ses", name: "Amazon SES", iconFile: "AmazonSimpleEmailService.svg", difficulty: 2, category: "integration" },
  { id: "systems-manager", name: "AWS Systems Manager", iconFile: "AWSSystemsManager.svg", difficulty: 2, category: "management" },
  { id: "eventbridge", name: "Amazon EventBridge", iconFile: "AmazonEventBridge.svg", difficulty: 2, category: "integration" },
  { id: "fargate", name: "AWS Fargate", iconFile: "AWSFargate.svg", difficulty: 2, category: "compute" },
  { id: "glue", name: "AWS Glue", iconFile: "AWSGlue.svg", difficulty: 2, category: "analytics" },
  { id: "athena", name: "Amazon Athena", iconFile: "AmazonAthena.svg", difficulty: 2, category: "analytics" },
  { id: "kms", name: "AWS KMS", iconFile: "AWSKeyManagementService.svg", difficulty: 2, category: "security" },
  { id: "efs", name: "Amazon EFS", iconFile: "AmazonEFS.svg", difficulty: 2, category: "storage" },

  // ===== DIFFICULTY 3 (Medium) - 20 services =====
  { id: "config", name: "AWS Config", iconFile: "AWSConfig.svg", difficulty: 3, category: "management" },
  { id: "cloudtrail", name: "AWS CloudTrail", iconFile: "AWSCloudTrail.svg", difficulty: 3, category: "management" },
  { id: "guardduty", name: "Amazon GuardDuty", iconFile: "AmazonGuardDuty.svg", difficulty: 3, category: "security" },
  { id: "shield", name: "AWS Shield", iconFile: "AWSShield.svg", difficulty: 3, category: "security" },
  { id: "inspector", name: "Amazon Inspector", iconFile: "AmazonInspector.svg", difficulty: 3, category: "security" },
  { id: "xray", name: "AWS X-Ray", iconFile: "AWSXRay.svg", difficulty: 3, category: "developer-tools" },
  { id: "rekognition", name: "Amazon Rekognition", iconFile: "AmazonRekognition.svg", difficulty: 3, category: "ml-ai" },
  { id: "textract", name: "Amazon Textract", iconFile: "AmazonTextract.svg", difficulty: 3, category: "ml-ai" },
  { id: "transcribe", name: "Amazon Transcribe", iconFile: "AmazonTranscribe.svg", difficulty: 3, category: "ml-ai" },
  { id: "polly", name: "Amazon Polly", iconFile: "AmazonPolly.svg", difficulty: 3, category: "ml-ai" },
  { id: "lex", name: "Amazon Lex", iconFile: "AmazonLex.svg", difficulty: 3, category: "ml-ai" },
  { id: "amplify", name: "AWS Amplify", iconFile: "AWSAmplify.svg", difficulty: 3, category: "developer-tools" },
  { id: "documentdb", name: "Amazon DocumentDB", iconFile: "AmazonDocumentDB.svg", difficulty: 3, category: "database" },
  { id: "neptune", name: "Amazon Neptune", iconFile: "AmazonNeptune.svg", difficulty: 3, category: "database" },
  { id: "msk", name: "Amazon MSK", iconFile: "AmazonManagedStreamingforApacheKafka.svg", difficulty: 3, category: "analytics" },
  { id: "connect", name: "Amazon Connect", iconFile: "AmazonConnect.svg", difficulty: 3, category: "other" },
  { id: "app-runner", name: "AWS App Runner", iconFile: "AWSAppRunner.svg", difficulty: 3, category: "compute" },
  { id: "opensearch", name: "Amazon OpenSearch Service", iconFile: "AmazonOpenSearchService.svg", difficulty: 3, category: "analytics" },
  { id: "quicksight", name: "Amazon QuickSight", iconFile: "AmazonQuickSight.svg", difficulty: 3, category: "analytics" },
  { id: "bedrock", name: "Amazon Bedrock", iconFile: "AmazonBedrock.svg", difficulty: 3, category: "ml-ai" },

  // ===== DIFFICULTY 4 (Hard) - 20 services =====
  { id: "batch", name: "AWS Batch", iconFile: "AWSBatch.svg", difficulty: 4, category: "compute" },
  { id: "lightsail", name: "Amazon Lightsail", iconFile: "AmazonLightsail.svg", difficulty: 4, category: "compute" },
  { id: "outposts", name: "AWS Outposts", iconFile: "AWSOutpostsfamily.svg", difficulty: 4, category: "compute" },
  { id: "workspaces", name: "Amazon WorkSpaces", iconFile: "AmazonWorkSpacesFamily.svg", difficulty: 4, category: "other" },
  { id: "direct-connect", name: "AWS Direct Connect", iconFile: "AWSDirectConnect.svg", difficulty: 4, category: "networking" },
  { id: "transit-gateway", name: "AWS Transit Gateway", iconFile: "AWSTransitGateway.svg", difficulty: 4, category: "networking" },
  { id: "managed-blockchain", name: "Amazon Managed Blockchain", iconFile: "AmazonManagedBlockchain.svg", difficulty: 4, category: "other" },
  { id: "iot-core", name: "AWS IoT Core", iconFile: "AWSIoTCore.svg", difficulty: 4, category: "iot" },
  { id: "timestream", name: "Amazon Timestream", iconFile: "AmazonTimestream.svg", difficulty: 4, category: "database" },
  { id: "qldb", name: "Amazon QLDB", iconFile: "AmazonQuantumLedgerDatabase.svg", difficulty: 4, category: "database" },
  { id: "lake-formation", name: "AWS Lake Formation", iconFile: "AWSLakeFormation.svg", difficulty: 4, category: "analytics" },
  { id: "emr", name: "Amazon EMR", iconFile: "AmazonEMR.svg", difficulty: 4, category: "analytics" },
  { id: "snowball", name: "AWS Snowball", iconFile: "AWSSnowball.svg", difficulty: 4, category: "migration" },
  { id: "macie", name: "Amazon Macie", iconFile: "AmazonMacie.svg", difficulty: 4, category: "security" },
  { id: "security-hub", name: "AWS Security Hub", iconFile: "AWSSecurityHub.svg", difficulty: 4, category: "security" },
  { id: "detective", name: "Amazon Detective", iconFile: "AmazonDetective.svg", difficulty: 4, category: "security" },
  { id: "backup", name: "AWS Backup", iconFile: "AWSBackup.svg", difficulty: 4, category: "storage" },
  { id: "transfer-family", name: "AWS Transfer Family", iconFile: "AWSTransferFamily.svg", difficulty: 4, category: "migration" },
  { id: "fsx", name: "Amazon FSx", iconFile: "AmazonFSx.svg", difficulty: 4, category: "storage" },
  { id: "datasync", name: "AWS DataSync", iconFile: "AWSDataSync.svg", difficulty: 4, category: "migration" },

  // ===== DIFFICULTY 5 (Very Hard) - 20 services =====
  { id: "proton", name: "AWS Proton", iconFile: "AWSProton.svg", difficulty: 5, category: "management" },
  { id: "memorydb", name: "Amazon MemoryDB", iconFile: "AmazonMemoryDB.svg", difficulty: 5, category: "database" },
  { id: "resilience-hub", name: "AWS Resilience Hub", iconFile: "AWSResilienceHub.svg", difficulty: 5, category: "management" },
  { id: "managed-grafana", name: "Amazon Managed Grafana", iconFile: "AmazonManagedGrafana.svg", difficulty: 5, category: "management" },
  { id: "managed-prometheus", name: "Amazon Managed Prometheus", iconFile: "AmazonManagedServiceforPrometheus.svg", difficulty: 5, category: "management" },
  { id: "control-tower", name: "AWS Control Tower", iconFile: "AWSControlTower.svg", difficulty: 5, category: "management" },
  { id: "service-catalog", name: "AWS Service Catalog", iconFile: "AWSServiceCatalog.svg", difficulty: 5, category: "management" },
  { id: "kendra", name: "Amazon Kendra", iconFile: "AmazonKendra.svg", difficulty: 5, category: "ml-ai" },
  { id: "ground-station", name: "AWS Ground Station", iconFile: "AWSGroundStation.svg", difficulty: 5, category: "other" },
  { id: "braket", name: "Amazon Braket", iconFile: "AmazonBraket.svg", difficulty: 5, category: "other" },
  { id: "iot-greengrass", name: "AWS IoT Greengrass", iconFile: "AWSIoTGreengrass.svg", difficulty: 5, category: "iot" },
  { id: "finspace", name: "Amazon FinSpace", iconFile: "AmazonFinSpace.svg", difficulty: 5, category: "analytics" },
  { id: "clean-rooms", name: "AWS Clean Rooms", iconFile: "AWSCleanRooms.svg", difficulty: 5, category: "analytics" },
  { id: "codecatalyst", name: "Amazon CodeCatalyst", iconFile: "AmazonCodeCatalyst.svg", difficulty: 5, category: "developer-tools" },
  { id: "amazon-q", name: "Amazon Q", iconFile: "AmazonQ.svg", difficulty: 5, category: "ml-ai" },
  { id: "datazone", name: "Amazon DataZone", iconFile: "AmazonDataZone.svg", difficulty: 5, category: "analytics" },
  { id: "media-convert", name: "AWS Elemental MediaConvert", iconFile: "AWSElementalMediaConvert.svg", difficulty: 5, category: "media" },
  { id: "app-mesh", name: "AWS App Mesh", iconFile: "AWSAppMesh.svg", difficulty: 5, category: "networking" },
  { id: "keyspaces", name: "Amazon Keyspaces", iconFile: "AmazonKeyspaces.svg", difficulty: 5, category: "database" },
  { id: "appflow", name: "Amazon AppFlow", iconFile: "AmazonAppFlow.svg", difficulty: 5, category: "integration" },
];

export function getServicesByDifficulty(difficulty: number): AwsService[] {
  return awsServices.filter((s) => s.difficulty === difficulty);
}

export function getServiceById(id: string): AwsService | undefined {
  return awsServices.find((s) => s.id === id);
}

export function getServiceByName(name: string): AwsService | undefined {
  return awsServices.find((s) => s.name === name);
}
