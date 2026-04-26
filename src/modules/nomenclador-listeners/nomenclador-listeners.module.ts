/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 *
 * NomencladorListenersModule — registra los listeners on<Nomenclador>Change
 * para todos los nomencladores referenciados por las entidades de este
 * microservicio. Se importa una sola vez desde app.module.ts.
 *
 * Generado por sources/scaffold_nomenclador_listeners.py — NO editar a mano.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { OnAccessCredentialTypeChangeListener } from './on-access-credential-type-change.listener';
import { OnAccessLevelChangeListener } from './on-access-level-change.listener';
import { OnAttendanceChannelChangeListener } from './on-attendance-channel-change.listener';
import { OnAttendanceStatusChangeListener } from './on-attendance-status-change.listener';
import { OnConfigurationParameterScopeChangeListener } from './on-configuration-parameter-scope-change.listener';
import { OnContractTypeChangeListener } from './on-contract-type-change.listener';
import { OnCredentialStatusChangeListener } from './on-credential-status-change.listener';
import { OnDocumentTypeExtendedChangeListener } from './on-document-type-extended-change.listener';
import { OnEmploymentStatusChangeListener } from './on-employment-status-change.listener';
import { OnGenderChangeListener } from './on-gender-change.listener';
import { OnHrmsPermissionsSourceChangeListener } from './on-hrms-permissions-source-change.listener';
import { OnLastAccessOutcomeChangeListener } from './on-last-access-outcome-change.listener';
import { OnLeaveRequestStatusChangeListener } from './on-leave-request-status-change.listener';
import { OnLeaveTypeChangeListener } from './on-leave-type-change.listener';
import { OnPayrollCycleStatusChangeListener } from './on-payroll-cycle-status-change.listener';
import { OnPayrollFrequencyChangeListener } from './on-payroll-frequency-change.listener';
import { OnPermissionEffectChangeListener } from './on-permission-effect-change.listener';
import { OnPersonAttributeScopeChangeListener } from './on-person-attribute-scope-change.listener';
import { OnPersonStatusChangeListener } from './on-person-status-change.listener';
import { OnReportsCategoryChangeListener } from './on-reports-category-change.listener';
import { OnScopeTypeChangeListener } from './on-scope-type-change.listener';
import { OnTimeEntryTypeChangeListener } from './on-time-entry-type-change.listener';
import { OnTrainingModalityChangeListener } from './on-training-modality-change.listener';

@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [
    OnAccessCredentialTypeChangeListener,
    OnAccessLevelChangeListener,
    OnAttendanceChannelChangeListener,
    OnAttendanceStatusChangeListener,
    OnConfigurationParameterScopeChangeListener,
    OnContractTypeChangeListener,
    OnCredentialStatusChangeListener,
    OnDocumentTypeExtendedChangeListener,
    OnEmploymentStatusChangeListener,
    OnGenderChangeListener,
    OnHrmsPermissionsSourceChangeListener,
    OnLastAccessOutcomeChangeListener,
    OnLeaveRequestStatusChangeListener,
    OnLeaveTypeChangeListener,
    OnPayrollCycleStatusChangeListener,
    OnPayrollFrequencyChangeListener,
    OnPermissionEffectChangeListener,
    OnPersonAttributeScopeChangeListener,
    OnPersonStatusChangeListener,
    OnReportsCategoryChangeListener,
    OnScopeTypeChangeListener,
    OnTimeEntryTypeChangeListener,
    OnTrainingModalityChangeListener,
  ],
  exports: [
    OnAccessCredentialTypeChangeListener,
    OnAccessLevelChangeListener,
    OnAttendanceChannelChangeListener,
    OnAttendanceStatusChangeListener,
    OnConfigurationParameterScopeChangeListener,
    OnContractTypeChangeListener,
    OnCredentialStatusChangeListener,
    OnDocumentTypeExtendedChangeListener,
    OnEmploymentStatusChangeListener,
    OnGenderChangeListener,
    OnHrmsPermissionsSourceChangeListener,
    OnLastAccessOutcomeChangeListener,
    OnLeaveRequestStatusChangeListener,
    OnLeaveTypeChangeListener,
    OnPayrollCycleStatusChangeListener,
    OnPayrollFrequencyChangeListener,
    OnPermissionEffectChangeListener,
    OnPersonAttributeScopeChangeListener,
    OnPersonStatusChangeListener,
    OnReportsCategoryChangeListener,
    OnScopeTypeChangeListener,
    OnTimeEntryTypeChangeListener,
    OnTrainingModalityChangeListener,
  ],
})
export class NomencladorListenersModule {}
