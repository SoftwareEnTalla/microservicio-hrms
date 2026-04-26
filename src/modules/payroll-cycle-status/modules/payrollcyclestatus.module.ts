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


import { Module } from "@nestjs/common";
import { PayrollCycleStatusCommandController } from "../controllers/payrollcyclestatuscommand.controller";
import { PayrollCycleStatusQueryController } from "../controllers/payrollcyclestatusquery.controller";
import { PayrollCycleStatusCommandService } from "../services/payrollcyclestatuscommand.service";
import { PayrollCycleStatusQueryService } from "../services/payrollcyclestatusquery.service";

import { PayrollCycleStatusCommandRepository } from "../repositories/payrollcyclestatuscommand.repository";
import { PayrollCycleStatusQueryRepository } from "../repositories/payrollcyclestatusquery.repository";
import { PayrollCycleStatusRepository } from "../repositories/payrollcyclestatus.repository";
import { PayrollCycleStatusResolver } from "../graphql/payrollcyclestatus.resolver";
import { PayrollCycleStatusAuthGuard } from "../guards/payrollcyclestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PayrollCycleStatus } from "../entities/payroll-cycle-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePayrollCycleStatusHandler } from "../commands/handlers/createpayrollcyclestatus.handler";
import { UpdatePayrollCycleStatusHandler } from "../commands/handlers/updatepayrollcyclestatus.handler";
import { DeletePayrollCycleStatusHandler } from "../commands/handlers/deletepayrollcyclestatus.handler";
import { GetPayrollCycleStatusByIdHandler } from "../queries/handlers/getpayrollcyclestatusbyid.handler";
import { GetPayrollCycleStatusByFieldHandler } from "../queries/handlers/getpayrollcyclestatusbyfield.handler";
import { GetAllPayrollCycleStatusHandler } from "../queries/handlers/getallpayrollcyclestatus.handler";
import { PayrollCycleStatusCrudSaga } from "../sagas/payrollcyclestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PayrollCycleStatusInterceptor } from "../interceptors/payrollcyclestatus.interceptor";
import { PayrollCycleStatusLoggingInterceptor } from "../interceptors/payrollcyclestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PayrollCycleStatus]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [PayrollCycleStatusCommandController, PayrollCycleStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    PayrollCycleStatusQueryService,
    PayrollCycleStatusCommandService,
  
    //Repositories
    PayrollCycleStatusCommandRepository,
    PayrollCycleStatusQueryRepository,
    PayrollCycleStatusRepository,      
    //Resolvers
    PayrollCycleStatusResolver,
    //Guards
    PayrollCycleStatusAuthGuard,
    //Interceptors
    PayrollCycleStatusInterceptor,
    PayrollCycleStatusLoggingInterceptor,
    //CQRS Handlers
    CreatePayrollCycleStatusHandler,
    UpdatePayrollCycleStatusHandler,
    DeletePayrollCycleStatusHandler,
    GetPayrollCycleStatusByIdHandler,
    GetPayrollCycleStatusByFieldHandler,
    GetAllPayrollCycleStatusHandler,
    PayrollCycleStatusCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    PayrollCycleStatusQueryService,
    PayrollCycleStatusCommandService,
  
    //Repositories
    PayrollCycleStatusCommandRepository,
    PayrollCycleStatusQueryRepository,
    PayrollCycleStatusRepository,      
    //Resolvers
    PayrollCycleStatusResolver,
    //Guards
    PayrollCycleStatusAuthGuard,
    //Interceptors
    PayrollCycleStatusInterceptor,
    PayrollCycleStatusLoggingInterceptor,
  ],
})
export class PayrollCycleStatusModule {}

