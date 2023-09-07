import * as process from 'process';

import { APIGatewayProxyResult } from 'aws-lambda';

import { v4 as uuidv4 } from 'uuid';
import * as createError from 'http-errors';

import dynamoDbDocumentClient from '../../services/dynamoDbDocumentClient';

import { AuditLog, EventBridgeEVent } from '../../types';

async function logAudit(
  event: EventBridgeEVent,
): Promise<APIGatewayProxyResult> {
  const { source, detail, 'detail-type': detailType } = event;

  const productId =
    (detail.newValue && JSON.parse(detail.newValue)?.id) ||
    (detail.oldValue && JSON.parse(detail.oldValue)?.id);

  const item: AuditLog = {
    id: uuidv4(),
    entityId: productId,
    entityName: source,
    changeType: detailType,
    oldValue: detail.oldValue,
    newValue: detail.newValue,
    modifiedAt: new Date().toISOString(),
  };

  try {
    await dynamoDbDocumentClient
      .put({
        Item: item,
        TableName: process.env.AUDIT_LOG_TABLE_NAME,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(JSON.stringify(error));
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      'Successfully Added Audit Log!' + JSON.stringify(event),
    ),
  };
}

export const handler = logAudit;
