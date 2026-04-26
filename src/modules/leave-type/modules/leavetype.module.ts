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
import { LeaveTypeCommandController } from "../controllers/leavetypecommand.controller";
import { LeaveTypeQueryController } from "../controllers/leavetypequery.controller";
import { LeaveTypeCommandService } from "../services/leavetypecommand.service";
import { LeaveTypeQueryService } from "../services/leavetypequery.service";

import { LeaveTypeCommandRepository } from "../repositories/leavetypecommand.repository";
import { LeaveTypeQueryRepository } from "../repositories/leavetypequery.repository";
import { LeaveTypeRepository } from "../repositories/leavetype.repository";
import { LeaveTypeResolver } from "../graphql/leavetype.resolver";
import { LeaveTypeAuthGuard } from "../guards/leavetypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaveType } from "../entities/leave-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateLeaveTypeHandler } from "../commands/handlers/createleavetype.handler";
import { UpdateLeaveTypeHandler } from "../commands/handlers/updateleavetype.handler";
import { DeleteLeaveTypeHandler } from "../commands/handlers/deleteleavetype.handler";
import { GetLeaveTypeByIdHandler } from "../queries/handlers/getleavetypebyid.handler";
import { GetLeaveTypeByFieldHandler } from "../queries/handlers/getleavetypebyfield.handler";
import { GetAllLeaveTypeHandler } from "../queries/handlers/getallleavetype.handler";
import { LeaveTypeCrudSaga } from "../sagas/leavetype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { LeaveTypeInterceptor } from "../interceptors/leavetype.interceptor";
import { LeaveTypeLoggingInterceptor } from "../interceptors/leavetype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, LeaveType]), // Incluir BaseEntity para herencia
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
  controllers: [LeaveTypeCommandController, LeaveTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    LeaveTypeQueryService,
    LeaveTypeCommandService,
  
    //Repositories
    LeaveTypeCommandRepository,
    LeaveTypeQueryRepository,
    LeaveTypeRepository,      
    //Resolvers
    LeaveTypeResolver,
    //Guards
    LeaveTypeAuthGuard,
    //Interceptors
    LeaveTypeInterceptor,
    LeaveTypeLoggingInterceptor,
    //CQRS Handlers
    CreateLeaveTypeHandler,
    UpdateLeaveTypeHandler,
    DeleteLeaveTypeHandler,
    GetLeaveTypeByIdHandler,
    GetLeaveTypeByFieldHandler,
    GetAllLeaveTypeHandler,
    LeaveTypeCrudSaga,
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
    LeaveTypeQueryService,
    LeaveTypeCommandService,
  
    //Repositories
    LeaveTypeCommandRepository,
    LeaveTypeQueryRepository,
    LeaveTypeRepository,      
    //Resolvers
    LeaveTypeResolver,
    //Guards
    LeaveTypeAuthGuard,
    //Interceptors
    LeaveTypeInterceptor,
    LeaveTypeLoggingInterceptor,
  ],
})
export class LeaveTypeModule {}

