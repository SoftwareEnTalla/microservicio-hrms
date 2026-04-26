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
import { EmploymentStatusCommandController } from "../controllers/employmentstatuscommand.controller";
import { EmploymentStatusQueryController } from "../controllers/employmentstatusquery.controller";
import { EmploymentStatusCommandService } from "../services/employmentstatuscommand.service";
import { EmploymentStatusQueryService } from "../services/employmentstatusquery.service";

import { EmploymentStatusCommandRepository } from "../repositories/employmentstatuscommand.repository";
import { EmploymentStatusQueryRepository } from "../repositories/employmentstatusquery.repository";
import { EmploymentStatusRepository } from "../repositories/employmentstatus.repository";
import { EmploymentStatusResolver } from "../graphql/employmentstatus.resolver";
import { EmploymentStatusAuthGuard } from "../guards/employmentstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmploymentStatus } from "../entities/employment-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateEmploymentStatusHandler } from "../commands/handlers/createemploymentstatus.handler";
import { UpdateEmploymentStatusHandler } from "../commands/handlers/updateemploymentstatus.handler";
import { DeleteEmploymentStatusHandler } from "../commands/handlers/deleteemploymentstatus.handler";
import { GetEmploymentStatusByIdHandler } from "../queries/handlers/getemploymentstatusbyid.handler";
import { GetEmploymentStatusByFieldHandler } from "../queries/handlers/getemploymentstatusbyfield.handler";
import { GetAllEmploymentStatusHandler } from "../queries/handlers/getallemploymentstatus.handler";
import { EmploymentStatusCrudSaga } from "../sagas/employmentstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { EmploymentStatusInterceptor } from "../interceptors/employmentstatus.interceptor";
import { EmploymentStatusLoggingInterceptor } from "../interceptors/employmentstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, EmploymentStatus]), // Incluir BaseEntity para herencia
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
  controllers: [EmploymentStatusCommandController, EmploymentStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    EmploymentStatusQueryService,
    EmploymentStatusCommandService,
  
    //Repositories
    EmploymentStatusCommandRepository,
    EmploymentStatusQueryRepository,
    EmploymentStatusRepository,      
    //Resolvers
    EmploymentStatusResolver,
    //Guards
    EmploymentStatusAuthGuard,
    //Interceptors
    EmploymentStatusInterceptor,
    EmploymentStatusLoggingInterceptor,
    //CQRS Handlers
    CreateEmploymentStatusHandler,
    UpdateEmploymentStatusHandler,
    DeleteEmploymentStatusHandler,
    GetEmploymentStatusByIdHandler,
    GetEmploymentStatusByFieldHandler,
    GetAllEmploymentStatusHandler,
    EmploymentStatusCrudSaga,
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
    EmploymentStatusQueryService,
    EmploymentStatusCommandService,
  
    //Repositories
    EmploymentStatusCommandRepository,
    EmploymentStatusQueryRepository,
    EmploymentStatusRepository,      
    //Resolvers
    EmploymentStatusResolver,
    //Guards
    EmploymentStatusAuthGuard,
    //Interceptors
    EmploymentStatusInterceptor,
    EmploymentStatusLoggingInterceptor,
  ],
})
export class EmploymentStatusModule {}

