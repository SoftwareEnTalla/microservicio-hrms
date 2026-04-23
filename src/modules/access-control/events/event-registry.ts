/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { BaseEvent } from './base.event';
import { AccessControlCreatedEvent } from './accesscontrolcreated.event';
import { AccessControlUpdatedEvent } from './accesscontrolupdated.event';
import { AccessControlDeletedEvent } from './accesscontroldeleted.event';
import { AccessCredentialIssuedEvent } from './accesscredentialissued.event';
import { AccessCredentialRevokedEvent } from './accesscredentialrevoked.event';
import { AccessCredentialLostEvent } from './accesscredentiallost.event';
import { AccessCredentialExpiredEvent } from './accesscredentialexpired.event';
import { AccessCredentialTimeoutEvent } from './accesscredentialtimeout.event';
import { AccessCredentialLockedEvent } from './accesscredentiallocked.event';
import { AccessEventRecordedEvent } from './accesseventrecorded.event';
import { AccessDeniedAlertRaisedEvent } from './accessdeniedalertraised.event';

export type RegisteredEventClass<T extends BaseEvent = BaseEvent> = new (
  aggregateId: string,
  payload: any
) => T;

export interface RegisteredEventDefinition<T extends BaseEvent = BaseEvent> {
  topic: string;
  eventName: string;
  version: string;
  eventClass: RegisteredEventClass<T>;
  retryTopic: string;
  dlqTopic: string;
  maxRetries: number;
  replayable: boolean;
}

const createEventDefinition = <T extends BaseEvent>(
  topic: string,
  eventClass: RegisteredEventClass<T>,
  overrides?: Partial<Omit<RegisteredEventDefinition<T>, 'topic' | 'eventName' | 'eventClass'>>,
): RegisteredEventDefinition<T> => ({
  topic,
  eventName: eventClass.name,
  version: overrides?.version ?? '1.0.0',
  eventClass,
  retryTopic: overrides?.retryTopic ?? topic + '-retry',
  dlqTopic: overrides?.dlqTopic ?? topic + '-dlq',
  maxRetries: overrides?.maxRetries ?? 3,
  replayable: overrides?.replayable ?? true,
});

const EVENT_DEFINITION_OVERRIDES: Partial<Record<string, Partial<Omit<RegisteredEventDefinition, 'topic' | 'eventName' | 'eventClass'>>>> = {
  'access-credential-issued': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'access-credential-revoked': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'access-credential-lost': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'access-credential-expired': {
    version: '1.0.0',
    maxRetries: 3,
    replayable: false,
  },
  'access-credential-timeout': {
    version: '1.0.0',
    maxRetries: 3,
    replayable: false,
  },
  'access-credential-locked': {
    version: '1.0.0',
    maxRetries: 3,
    replayable: false,
  },
  'access-event-recorded': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'access-denied-alert-raised': {
    version: '1.0.0',
    maxRetries: 3,
    replayable: false,
  },
};

export const EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'access-control-created': createEventDefinition('access-control-created', AccessControlCreatedEvent, EVENT_DEFINITION_OVERRIDES['access-control-created']),
  'access-control-updated': createEventDefinition('access-control-updated', AccessControlUpdatedEvent, EVENT_DEFINITION_OVERRIDES['access-control-updated']),
  'access-control-deleted': createEventDefinition('access-control-deleted', AccessControlDeletedEvent, EVENT_DEFINITION_OVERRIDES['access-control-deleted']),
  'access-credential-issued': createEventDefinition('access-credential-issued', AccessCredentialIssuedEvent, EVENT_DEFINITION_OVERRIDES['access-credential-issued']),
  'access-credential-revoked': createEventDefinition('access-credential-revoked', AccessCredentialRevokedEvent, EVENT_DEFINITION_OVERRIDES['access-credential-revoked']),
  'access-credential-lost': createEventDefinition('access-credential-lost', AccessCredentialLostEvent, EVENT_DEFINITION_OVERRIDES['access-credential-lost']),
  'access-credential-expired': createEventDefinition('access-credential-expired', AccessCredentialExpiredEvent, EVENT_DEFINITION_OVERRIDES['access-credential-expired']),
  'access-credential-timeout': createEventDefinition('access-credential-timeout', AccessCredentialTimeoutEvent, EVENT_DEFINITION_OVERRIDES['access-credential-timeout']),
  'access-credential-locked': createEventDefinition('access-credential-locked', AccessCredentialLockedEvent, EVENT_DEFINITION_OVERRIDES['access-credential-locked']),
  'access-event-recorded': createEventDefinition('access-event-recorded', AccessEventRecordedEvent, EVENT_DEFINITION_OVERRIDES['access-event-recorded']),
  'access-denied-alert-raised': createEventDefinition('access-denied-alert-raised', AccessDeniedAlertRaisedEvent, EVENT_DEFINITION_OVERRIDES['access-denied-alert-raised']),
};

export const EVENT_REGISTRY: Record<string, RegisteredEventClass> = Object.fromEntries(
  Object.values(EVENT_DEFINITIONS).map((definition) => [definition.topic, definition.eventClass])
);

export const EVENT_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.topic);
export const EVENT_RETRY_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.retryTopic);
export const EVENT_DLQ_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.dlqTopic);
export const EVENT_CONSUMER_TOPICS = Array.from(new Set([...EVENT_TOPICS, ...EVENT_RETRY_TOPICS]));
export const EVENT_ADMIN_TOPICS = Array.from(new Set([...EVENT_TOPICS, ...EVENT_RETRY_TOPICS, ...EVENT_DLQ_TOPICS]));

export const resolveEventDefinition = (candidate?: string): RegisteredEventDefinition | undefined => {
  if (!candidate) {
    return undefined;
  }

  if (EVENT_DEFINITIONS[candidate]) {
    return EVENT_DEFINITIONS[candidate];
  }

  return Object.values(EVENT_DEFINITIONS).find(
    (definition) =>
      definition.topic === candidate ||
      definition.retryTopic === candidate ||
      definition.dlqTopic === candidate ||
      definition.eventName === candidate,
  );
};
