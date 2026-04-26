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
import { PayrollFrequencyCommandController } from "../controllers/payrollfrequencycommand.controller";
import { PayrollFrequencyQueryController } from "../controllers/payrollfrequencyquery.controller";
import { PayrollFrequencyCommandService } from "../services/payrollfrequencycommand.service";
import { PayrollFrequencyQueryService } from "../services/payrollfrequencyquery.service";

import { PayrollFrequencyCommandRepository } from "../repositories/payrollfrequencycommand.repository";
import { PayrollFrequencyQueryRepository } from "../repositories/payrollfrequencyquery.repository";
import { PayrollFrequencyRepository } from "../repositories/payrollfrequency.repository";
import { PayrollFrequencyResolver } from "../graphql/payrollfrequency.resolver";
import { PayrollFrequencyAuthGuard } from "../guards/payrollfrequencyauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PayrollFrequency } from "../entities/payroll-frequency.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePayrollFrequencyHandler } from "../commands/handlers/createpayrollfrequency.handler";
import { UpdatePayrollFrequencyHandler } from "../commands/handlers/updatepayrollfrequency.handler";
import { DeletePayrollFrequencyHandler } from "../commands/handlers/deletepayrollfrequency.handler";
import { GetPayrollFrequencyByIdHandler } from "../queries/handlers/getpayrollfrequencybyid.handler";
import { GetPayrollFrequencyByFieldHandler } from "../queries/handlers/getpayrollfrequencybyfield.handler";
import { GetAllPayrollFrequencyHandler } from "../queries/handlers/getallpayrollfrequency.handler";
import { PayrollFrequencyCrudSaga } from "../sagas/payrollfrequency-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PayrollFrequencyInterceptor } from "../interceptors/payrollfrequency.interceptor";
import { PayrollFrequencyLoggingInterceptor } from "../interceptors/payrollfrequency.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PayrollFrequency]), // Incluir BaseEntity para herencia
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
  controllers: [PayrollFrequencyCommandController, PayrollFrequencyQueryController],
  providers: [
    //Services
    EventStoreService,
    PayrollFrequencyQueryService,
    PayrollFrequencyCommandService,
  
    //Repositories
    PayrollFrequencyCommandRepository,
    PayrollFrequencyQueryRepository,
    PayrollFrequencyRepository,      
    //Resolvers
    PayrollFrequencyResolver,
    //Guards
    PayrollFrequencyAuthGuard,
    //Interceptors
    PayrollFrequencyInterceptor,
    PayrollFrequencyLoggingInterceptor,
    //CQRS Handlers
    CreatePayrollFrequencyHandler,
    UpdatePayrollFrequencyHandler,
    DeletePayrollFrequencyHandler,
    GetPayrollFrequencyByIdHandler,
    GetPayrollFrequencyByFieldHandler,
    GetAllPayrollFrequencyHandler,
    PayrollFrequencyCrudSaga,
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
    PayrollFrequencyQueryService,
    PayrollFrequencyCommandService,
  
    //Repositories
    PayrollFrequencyCommandRepository,
    PayrollFrequencyQueryRepository,
    PayrollFrequencyRepository,      
    //Resolvers
    PayrollFrequencyResolver,
    //Guards
    PayrollFrequencyAuthGuard,
    //Interceptors
    PayrollFrequencyInterceptor,
    PayrollFrequencyLoggingInterceptor,
  ],
})
export class PayrollFrequencyModule {}

