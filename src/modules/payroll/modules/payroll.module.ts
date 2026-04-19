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
import { PayrollCommandController } from "../controllers/payrollcommand.controller";
import { PayrollQueryController } from "../controllers/payrollquery.controller";
import { PayrollCommandService } from "../services/payrollcommand.service";
import { PayrollQueryService } from "../services/payrollquery.service";

import { PayrollCommandRepository } from "../repositories/payrollcommand.repository";
import { PayrollQueryRepository } from "../repositories/payrollquery.repository";
import { PayrollRepository } from "../repositories/payroll.repository";
import { PayrollResolver } from "../graphql/payroll.resolver";
import { PayrollAuthGuard } from "../guards/payrollauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payroll } from "../entities/payroll.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePayrollHandler } from "../commands/handlers/createpayroll.handler";
import { UpdatePayrollHandler } from "../commands/handlers/updatepayroll.handler";
import { DeletePayrollHandler } from "../commands/handlers/deletepayroll.handler";
import { GetPayrollByIdHandler } from "../queries/handlers/getpayrollbyid.handler";
import { GetPayrollByFieldHandler } from "../queries/handlers/getpayrollbyfield.handler";
import { GetAllPayrollHandler } from "../queries/handlers/getallpayroll.handler";
import { PayrollCrudSaga } from "../sagas/payroll-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PayrollInterceptor } from "../interceptors/payroll.interceptor";
import { PayrollLoggingInterceptor } from "../interceptors/payroll.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Payroll]), // Incluir BaseEntity para herencia
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
  controllers: [PayrollCommandController, PayrollQueryController],
  providers: [
    //Services
    EventStoreService,
    PayrollQueryService,
    PayrollCommandService,
  
    //Repositories
    PayrollCommandRepository,
    PayrollQueryRepository,
    PayrollRepository,      
    //Resolvers
    PayrollResolver,
    //Guards
    PayrollAuthGuard,
    //Interceptors
    PayrollInterceptor,
    PayrollLoggingInterceptor,
    //CQRS Handlers
    CreatePayrollHandler,
    UpdatePayrollHandler,
    DeletePayrollHandler,
    GetPayrollByIdHandler,
    GetPayrollByFieldHandler,
    GetAllPayrollHandler,
    PayrollCrudSaga,
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
    PayrollQueryService,
    PayrollCommandService,
  
    //Repositories
    PayrollCommandRepository,
    PayrollQueryRepository,
    PayrollRepository,      
    //Resolvers
    PayrollResolver,
    //Guards
    PayrollAuthGuard,
    //Interceptors
    PayrollInterceptor,
    PayrollLoggingInterceptor,
  ],
})
export class PayrollModule {}

