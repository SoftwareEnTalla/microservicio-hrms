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


import { DynamicModule, Module, OnModuleInit, Optional, Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { HrmsCommandController } from "./modules/hrms/controllers/hrmscommand.controller";
import { HrmsModule } from "./modules/hrms/modules/hrms.module";
import { CqrsModule } from "@nestjs/cqrs";
import { AppDataSource, initializeDatabase } from "./data-source";
import { HrmsQueryController } from "./modules/hrms/controllers/hrmsquery.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import GraphQLJSON from "graphql-type-json";
import { HrmsCommandService } from "./modules/hrms/services/hrmscommand.service";
import { HrmsQueryService } from "./modules/hrms/services/hrmsquery.service";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggingModule } from "./modules/hrms/modules/logger.module";
import { ModuleRef } from "@nestjs/core";
import { ServiceRegistry } from "@core/service-registry";
import LoggerService, { logger } from "@core/logs/logger";
import { AccessControlModule } from "./modules/access-control/modules/accesscontrol.module";
import { AccessControlCommandService } from "./modules/access-control/services/accesscontrolcommand.service";
import { AccessControlQueryService } from "./modules/access-control/services/accesscontrolquery.service";
import { AttendanceModule } from "./modules/attendance/modules/attendance.module";
import { AttendanceCommandService } from "./modules/attendance/services/attendancecommand.service";
import { AttendanceQueryService } from "./modules/attendance/services/attendancequery.service";
import { CatalogSyncLogModule } from "./modules/catalog-sync-log/modules/catalogsynclog.module";
import { CatalogSyncLogCommandService } from "./modules/catalog-sync-log/services/catalogsynclogcommand.service";
import { CatalogSyncLogQueryService } from "./modules/catalog-sync-log/services/catalogsynclogquery.service";
import { ConfigurationParameterModule } from "./modules/configuration-parameter/modules/configurationparameter.module";
import { ConfigurationParameterCommandService } from "./modules/configuration-parameter/services/configurationparametercommand.service";
import { ConfigurationParameterQueryService } from "./modules/configuration-parameter/services/configurationparameterquery.service";
import { EmployeeAttributeModule } from "./modules/employee-attribute/modules/employeeattribute.module";
import { EmployeeAttributeCommandService } from "./modules/employee-attribute/services/employeeattributecommand.service";
import { EmployeeAttributeQueryService } from "./modules/employee-attribute/services/employeeattributequery.service";
import { EmployeeModule } from "./modules/employee/modules/employee.module";
import { EmployeeCommandService } from "./modules/employee/services/employeecommand.service";
import { EmployeeQueryService } from "./modules/employee/services/employeequery.service";
import { HrmsPermissionsModule } from "./modules/hrms-permissions/modules/hrmspermissions.module";
import { HrmsPermissionsCommandService } from "./modules/hrms-permissions/services/hrmspermissionscommand.service";
import { HrmsPermissionsQueryService } from "./modules/hrms-permissions/services/hrmspermissionsquery.service";
import { LeaveRequestModule } from "./modules/leave-request/modules/leaverequest.module";
import { LeaveRequestCommandService } from "./modules/leave-request/services/leaverequestcommand.service";
import { LeaveRequestQueryService } from "./modules/leave-request/services/leaverequestquery.service";
import { PayrollModule } from "./modules/payroll/modules/payroll.module";
import { PayrollCommandService } from "./modules/payroll/services/payrollcommand.service";
import { PayrollQueryService } from "./modules/payroll/services/payrollquery.service";
import { PersonAttributeModule } from "./modules/person-attribute/modules/personattribute.module";
import { PersonAttributeCommandService } from "./modules/person-attribute/services/personattributecommand.service";
import { PersonAttributeQueryService } from "./modules/person-attribute/services/personattributequery.service";
import { PersonModule } from "./modules/person/modules/person.module";
import { PersonCommandService } from "./modules/person/services/personcommand.service";
import { PersonQueryService } from "./modules/person/services/personquery.service";
import { ReportsModule } from "./modules/reports/modules/reports.module";
import { ReportsCommandService } from "./modules/reports/services/reportscommand.service";
import { ReportsQueryService } from "./modules/reports/services/reportsquery.service";
import { TrainingModule } from "./modules/training/modules/training.module";
import { TrainingCommandService } from "./modules/training/services/trainingcommand.service";
import { TrainingQueryService } from "./modules/training/services/trainingquery.service";

import { CatalogClientModule } from "./modules/catalog-client/catalog-client.module";

/*
//TODO unused for while dependencies
import { I18nModule } from "nestjs-i18n";
import { join } from "path";
import { CustomI18nLoader } from "./core/loaders/custom-I18n-Loader";
import { TranslocoService } from "@jsverse/transloco";
import { HeaderResolver, AcceptLanguageResolver } from "nestjs-i18n";
import { TranslocoWrapperService } from "./core/services/transloco-wrapper.service";
import { TranslocoModule } from "@ngneat/transloco";
import LoggerService, { logger } from "@core/logs/logger";

*/

import { HorizontalModule } from "@common/horizontal";

import { NomencladorListenersModule } from './modules/nomenclador-listeners/nomenclador-listeners.module';
import { AccessCredentialTypeModule } from "./modules/access-credential-type/modules/accesscredentialtype.module";
import { AccessLevelModule } from "./modules/access-level/modules/accesslevel.module";
import { AttendanceChannelModule } from "./modules/attendance-channel/modules/attendancechannel.module";
import { AttendanceStatusModule } from "./modules/attendance-status/modules/attendancestatus.module";
import { ConfigurationParameterScopeModule } from "./modules/configuration-parameter-scope/modules/configurationparameterscope.module";
import { ContractTypeModule } from "./modules/contract-type/modules/contracttype.module";
import { CredentialStatusModule } from "./modules/credential-status/modules/credentialstatus.module";
import { EmploymentStatusModule } from "./modules/employment-status/modules/employmentstatus.module";
import { GenderModule } from "./modules/gender/modules/gender.module";
import { HrmsPermissionsSourceModule } from "./modules/hrms-permissions-source/modules/hrmspermissionssource.module";
import { LastAccessOutcomeModule } from "./modules/last-access-outcome/modules/lastaccessoutcome.module";
import { LeaveRequestStatusModule } from "./modules/leave-request-status/modules/leaverequeststatus.module";
import { LeaveTypeModule } from "./modules/leave-type/modules/leavetype.module";
import { PayrollCycleStatusModule } from "./modules/payroll-cycle-status/modules/payrollcyclestatus.module";
import { PayrollFrequencyModule } from "./modules/payroll-frequency/modules/payrollfrequency.module";
import { PersonAttributeScopeModule } from "./modules/person-attribute-scope/modules/personattributescope.module";
import { PersonStatusModule } from "./modules/person-status/modules/personstatus.module";
import { ReportsCategoryModule } from "./modules/reports-category/modules/reportscategory.module";
import { ScopeTypeModule } from "./modules/scope-type/modules/scopetype.module";
import { TimeEntryTypeModule } from "./modules/time-entry-type/modules/timeentrytype.module";
import { TrainingModalityModule } from "./modules/training-modality/modules/trainingmodality.module";
@Module({
  imports: [
    // Se importa/registra el módulo de caché
    CacheModule.register(),

    /**
     * ConfigModule - Configuración global de variables de entorno
     *
     * Configuración centralizada para el manejo de variables de entorno.
     * Se establece como global para estar disponible en toda la aplicación.
     */
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en todos los módulos sin necesidad de importar
      envFilePath: ".env", // Ubicación del archivo .env
      cache: true, // Mejora rendimiento cacheando las variables
      expandVariables: true, // Permite usar variables anidadas (ej: )
    }),

    /**
     * TypeOrmModule - Configuración de la base de datos
     *
     * Conexión asíncrona con PostgreSQL y configuración avanzada.
     * Se inicializa primero la conexión a la base de datos.
     */
    // TypeORM solo si INCLUDING_DATA_BASE_SYSTEM=true
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => {
              const dataSource = await initializeDatabase();
              return {
                ...dataSource.options,
                autoLoadEntities: true,
                retryAttempts: 5,
                retryDelay: 3000,
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.DB_LOGGING === "true",
              };
            },
          }),
        ]
      : []),

    /**
     * Módulos Hrms de la aplicación
     */
    CqrsModule,
    HorizontalModule,
    HrmsModule,
        AccessControlModule,
    AttendanceModule,
    CatalogSyncLogModule,
    ConfigurationParameterModule,
    EmployeeAttributeModule,
    EmployeeModule,
    HrmsPermissionsModule,
    LeaveRequestModule,
    PayrollModule,
    PersonAttributeModule,
    PersonModule,
    ReportsModule,
    TrainingModule,    
    /**
     * Módulo Logger de la aplicación
     */
    CatalogClientModule,
    LoggingModule,

    // GraphQL solo si GRAPHQL_ENABLED=true
    ...(process.env.GRAPHQL_ENABLED === 'true'
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            buildSchemaOptions: {
              dateScalarMode: "timestamp",
            },
            resolvers: { JSON: GraphQLJSON },
          }),
        ]
      : []),
  
    NomencladorListenersModule,
      AccessCredentialTypeModule,
    AccessLevelModule,
    AttendanceChannelModule,
    AttendanceStatusModule,
    ConfigurationParameterScopeModule,
    ContractTypeModule,
    CredentialStatusModule,
    EmploymentStatusModule,
    GenderModule,
    HrmsPermissionsSourceModule,
    LastAccessOutcomeModule,
    LeaveRequestStatusModule,
    LeaveTypeModule,
    PayrollCycleStatusModule,
    PayrollFrequencyModule,
    PersonAttributeScopeModule,
    PersonStatusModule,
    ReportsCategoryModule,
    ScopeTypeModule,
    TimeEntryTypeModule,
    TrainingModalityModule,
  ],

  /**
   * Controladores de Hrms
   *
   * Registro de controladores a nivel de aplicación.
   */
  controllers: [
  //No se recomienda habilitar los controladores si ya fueron declarados en el módulo: HrmsModule
  /*
  
  HrmsCommandController, 
  HrmsQueryController
  
  */
  ],

  /**
   * Proveedores (Servicios, Repositorios, etc.) de Hrms
   *
   * Registro de servicios globales y configuración de inyección de dependencias.
   */
  providers: [
    // Configuración de Base de datos
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          {
            provide: DataSource,
            useValue: AppDataSource,
          },
        ]
      : []),
    // Se importan los servicios del módulo
    HrmsCommandService,
    HrmsQueryService,
    LoggerService
  ],

  /**
   * Exportaciones de módulos y servicios
   *
   * Hace disponibles módulos y servicios para otros módulos que importen este módulo.
   */
  exports: [HrmsCommandService, HrmsQueryService,LoggerService],
})
export class HrmsAppModule implements OnModuleInit {
  /**
   * Constructor del módulo principal
   * @param dataSource Instancia inyectada del DataSource
   * @param translocoService Servicio para manejo de idiomas
   */
  constructor(
    private moduleRef: ModuleRef,
    @Optional() @Inject(DataSource) private readonly dataSource?: DataSource
  ) {
    if (process.env.INCLUDING_DATA_BASE_SYSTEM === 'true') {
      this.checkDatabaseConnection();
    }
    this.setupLanguageChangeHandling();
    this.onModuleInit();
  }
  onModuleInit() {
    //Inicializar servicios del microservicio
    ServiceRegistry.getInstance().setModuleRef(this.moduleRef);
    ServiceRegistry.getInstance().registryAll([
      HrmsCommandService,
      HrmsQueryService,
      AccessControlCommandService,
      AccessControlQueryService,
      AttendanceCommandService,
      AttendanceQueryService,
      CatalogSyncLogCommandService,
      CatalogSyncLogQueryService,
      ConfigurationParameterCommandService,
      ConfigurationParameterQueryService,
      EmployeeAttributeCommandService,
      EmployeeAttributeQueryService,
      EmployeeCommandService,
      EmployeeQueryService,
      HrmsPermissionsCommandService,
      HrmsPermissionsQueryService,
      LeaveRequestCommandService,
      LeaveRequestQueryService,
      PayrollCommandService,
      PayrollQueryService,
      PersonAttributeCommandService,
      PersonAttributeQueryService,
      PersonCommandService,
      PersonQueryService,
      ReportsCommandService,
      ReportsQueryService,
      TrainingCommandService,
      TrainingQueryService,    
    ]);
    const loggerService = ServiceRegistry.getInstance().get(
      "LoggerService"
    ) as LoggerService;
    if (loggerService) 
    loggerService.log(ServiceRegistry.getInstance());
  }
  /**
   * Verifica la conexión a la base de datos al iniciar
   *
   * Realiza una consulta simple para confirmar que la conexión está activa.
   * Termina la aplicación si no puede establecer conexión.
   */
  private async checkDatabaseConnection() {
    try {
      if (!this.dataSource) return;
      await this.dataSource.query("SELECT 1");
      logger.log("✅ Conexión a la base de datos verificada correctamente");
    } catch (error) {
      logger.error(
        "❌ Error crítico: No se pudo conectar a la base de datos",
        error
      );
      process.exit(1); // Termina la aplicación con código de error
    }
  }

  /**
   * Configura el manejo de cambios de idioma
   *
   * Suscribe a eventos de cambio de idioma para mantener consistencia.
   */
  private setupLanguageChangeHandling() {}
}


