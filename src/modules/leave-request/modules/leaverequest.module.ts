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
import { LeaveRequestCommandController } from "../controllers/leaverequestcommand.controller";
import { LeaveRequestQueryController } from "../controllers/leaverequestquery.controller";
import { LeaveRequestCommandService } from "../services/leaverequestcommand.service";
import { LeaveRequestQueryService } from "../services/leaverequestquery.service";

import { LeaveRequestCommandRepository } from "../repositories/leaverequestcommand.repository";
import { LeaveRequestQueryRepository } from "../repositories/leaverequestquery.repository";
import { LeaveRequestRepository } from "../repositories/leaverequest.repository";
import { LeaveRequestResolver } from "../graphql/leaverequest.resolver";
import { LeaveRequestAuthGuard } from "../guards/leaverequestauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaveRequest } from "../entities/leave-request.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateLeaveRequestHandler } from "../commands/handlers/createleaverequest.handler";
import { UpdateLeaveRequestHandler } from "../commands/handlers/updateleaverequest.handler";
import { DeleteLeaveRequestHandler } from "../commands/handlers/deleteleaverequest.handler";
import { GetLeaveRequestByIdHandler } from "../queries/handlers/getleaverequestbyid.handler";
import { GetLeaveRequestByFieldHandler } from "../queries/handlers/getleaverequestbyfield.handler";
import { GetAllLeaveRequestHandler } from "../queries/handlers/getallleaverequest.handler";
import { LeaveRequestCrudSaga } from "../sagas/leaverequest-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { LeaveRequestInterceptor } from "../interceptors/leaverequest.interceptor";
import { LeaveRequestLoggingInterceptor } from "../interceptors/leaverequest.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, LeaveRequest]), // Incluir BaseEntity para herencia
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
  controllers: [LeaveRequestCommandController, LeaveRequestQueryController],
  providers: [
    //Services
    EventStoreService,
    LeaveRequestQueryService,
    LeaveRequestCommandService,
  
    //Repositories
    LeaveRequestCommandRepository,
    LeaveRequestQueryRepository,
    LeaveRequestRepository,      
    //Resolvers
    LeaveRequestResolver,
    //Guards
    LeaveRequestAuthGuard,
    //Interceptors
    LeaveRequestInterceptor,
    LeaveRequestLoggingInterceptor,
    //CQRS Handlers
    CreateLeaveRequestHandler,
    UpdateLeaveRequestHandler,
    DeleteLeaveRequestHandler,
    GetLeaveRequestByIdHandler,
    GetLeaveRequestByFieldHandler,
    GetAllLeaveRequestHandler,
    LeaveRequestCrudSaga,
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
    LeaveRequestQueryService,
    LeaveRequestCommandService,
  
    //Repositories
    LeaveRequestCommandRepository,
    LeaveRequestQueryRepository,
    LeaveRequestRepository,      
    //Resolvers
    LeaveRequestResolver,
    //Guards
    LeaveRequestAuthGuard,
    //Interceptors
    LeaveRequestInterceptor,
    LeaveRequestLoggingInterceptor,
  ],
})
export class LeaveRequestModule {}

