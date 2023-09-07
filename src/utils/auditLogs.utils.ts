import * as process from 'process';

import * as AWS from 'aws-sdk';

import { AuditLogActionCreateRequest } from '../types';

const eventBridge = new AWS.EventBridge();

export async function addToAuditLog({
  entityName,
  action,
  newValue,
  oldValue,
}: AuditLogActionCreateRequest) {
  await eventBridge
    .putEvents({
      Entries: [
        {
          EventBusName: process.env.EVENT_BUS_NAME,
          Source: entityName,
          DetailType: action,
          Detail: JSON.stringify({
            newValue: JSON.stringify(newValue),
            oldValue: JSON.stringify(oldValue),
          }),
        },
      ],
    })
    .promise();
}
