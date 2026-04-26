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
import { LeaveRequestStatusCommandController } from "../controllers/leaverequeststatuscommand.controller";
import { LeaveRequestStatusQueryController } from "../controllers/leaverequeststatusquery.controller";
import { LeaveRequestStatusCommandService } from "../services/leaverequeststatuscommand.service";
import { LeaveRequestStatusQueryService } from "../services/leaverequeststatusquery.service";

import { LeaveRequestStatusCommandRepository } from "../repositories/leaverequeststatuscommand.repository";
import { LeaveRequestStatusQueryRepository } from "../repositories/leaverequeststatusquery.repository";
import { LeaveRequestStatusRepository } from "../repositories/leaverequeststatus.repository";
import { LeaveRequestStatusResolver } from "../graphql/leaverequeststatus.resolver";
import { LeaveRequestStatusAuthGuard } from "../guards/leaverequeststatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaveRequestStatus } from "../entities/leave-request-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateLeaveRequestStatusHandler } from "../commands/handlers/createleaverequeststatus.handler";
import { UpdateLeaveRequestStatusHandler } from "../commands/handlers/updateleaverequeststatus.handler";
import { DeleteLeaveRequestStatusHandler } from "../commands/handlers/deleteleaverequeststatus.handler";
import { GetLeaveRequestStatusByIdHandler } from "../queries/handlers/getleaverequeststatusbyid.handler";
import { GetLeaveRequestStatusByFieldHandler } from "../queries/handlers/getleaverequeststatusbyfield.handler";
import { GetAllLeaveRequestStatusHandler } from "../queries/handlers/getallleaverequeststatus.handler";
import { LeaveRequestStatusCrudSaga } from "../sagas/leaverequeststatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { LeaveRequestStatusInterceptor } from "../interceptors/leaverequeststatus.interceptor";
import { LeaveRequestStatusLoggingInterceptor } from "../interceptors/leaverequeststatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, LeaveRequestStatus]), // Incluir BaseEntity para herencia
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
  controllers: [LeaveRequestStatusCommandController, LeaveRequestStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    LeaveRequestStatusQueryService,
    LeaveRequestStatusCommandService,
  
    //Repositories
    LeaveRequestStatusCommandRepository,
    LeaveRequestStatusQueryRepository,
    LeaveRequestStatusRepository,      
    //Resolvers
    LeaveRequestStatusResolver,
    //Guards
    LeaveRequestStatusAuthGuard,
    //Interceptors
    LeaveRequestStatusInterceptor,
    LeaveRequestStatusLoggingInterceptor,
    //CQRS Handlers
    CreateLeaveRequestStatusHandler,
    UpdateLeaveRequestStatusHandler,
    DeleteLeaveRequestStatusHandler,
    GetLeaveRequestStatusByIdHandler,
    GetLeaveRequestStatusByFieldHandler,
    GetAllLeaveRequestStatusHandler,
    LeaveRequestStatusCrudSaga,
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
    LeaveRequestStatusQueryService,
    LeaveRequestStatusCommandService,
  
    //Repositories
    LeaveRequestStatusCommandRepository,
    LeaveRequestStatusQueryRepository,
    LeaveRequestStatusRepository,      
    //Resolvers
    LeaveRequestStatusResolver,
    //Guards
    LeaveRequestStatusAuthGuard,
    //Interceptors
    LeaveRequestStatusInterceptor,
    LeaveRequestStatusLoggingInterceptor,
  ],
})
export class LeaveRequestStatusModule {}

