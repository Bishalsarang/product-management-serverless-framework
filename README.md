# Product CRUD using Serverless Framework

This repository contains a simple CRUD application using serverless framework.

## Features

1. CRUD for `products`
2. Audit Log for product created/deleted/updated
3. Serverless offline and dynamodb for local development
4. Github Actions for auto deployment
5. Typescript
6. Static Test using Eslint, Prettier & Husky
7. Schema validation with `zod`
8. Middy middleware for normalizing request and handling errors

## Architecture Diagram

![architecture-diagram.png](assets%2Farchitecture-diagram.png)

The following AWS Services are involved:

1. AWS API Gateway
   1. Expose `/products` endpoint
2. AWS Lambda
   1. CRUD for products
   2. Lambda to log audit logs when product is created, updated, deleted
3. DynamoDB
   1.ProductsTable to store products data
   1. AuditLogTable to store generic audit log
4. EventBridge
   1. Events are added by products lambda function on successful add, delete and update
   2. The event triggers the lambda function which writes the audit log to the database
5. Amazon S3
   1. Stores product images

## Schema

```ts
// Product Schema
type Product = {
   id: string;
   name: string;
   price: number;
   description?: string;
   imageURL?: string;
}

// Audit Log Schema
type AuditLog = {
   id: string;
   entityName: "products";
   changeType: "created" | "deleted" | "updated";
   modifiedAt: string;
   entityId?: string | undefined;
   oldValue?: string | undefined;
   newValue?: string | undefined;
}
```

## Endpoints

1. `POST` /products
2. `GET` /products
3. `DELETE` products/:id
4. `PATCH` products/image/:id

### Local development

### Serverless Offline

```bash
 sls offline
```

This [Serverless plugin](https://www.serverless.com/plugins/serverless-offline) emulates AWS λ and API Gateway on your
local machine to speed up your development cycles.
This will expose the API endpoints to test out locally.

```bash
Function names exposed for local invocation by aws-sdk:
           * hello: product-management-dev-hello

   ┌─────────────────────────────────────────────────────────────────────────┐
   │                                                                         │
   │   GET | http://localhost:3000/hello                                     │
   │   POST | http://localhost:3000/2015-03-31/functions/hello/invocations   │
   │                                                                         │
   └─────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

### Dynamodb Local

1. Install the dynamodb local using:

```bash
sls dynamodb install
```

2. Run the dynamodb local

```bash
sls dynamodb start
```

```
Running "serverless" from node_modules
Dynamodb Local Started, Visit: http://localhost:8000/shell
```

3. Add connection in NoSQL Workbench
   ![img.png](assets/img.png)

### Loading environment variables

1. In `serverless.yml`, set

```yaml
service: product-management
frameworkVersion: '3'

plugins:
   - serverless-bundle
   - serverless-dynamodb
   - serverless-offline

useDotenv: true

provider:
   name: aws
   runtime: nodejs18.x
...
```

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function hello
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  hello: aws-node-project-dev-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function hello
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": {}\n}"
}
```
