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
import { AttendanceChannelCommandController } from "../controllers/attendancechannelcommand.controller";
import { AttendanceChannelQueryController } from "../controllers/attendancechannelquery.controller";
import { AttendanceChannelCommandService } from "../services/attendancechannelcommand.service";
import { AttendanceChannelQueryService } from "../services/attendancechannelquery.service";

import { AttendanceChannelCommandRepository } from "../repositories/attendancechannelcommand.repository";
import { AttendanceChannelQueryRepository } from "../repositories/attendancechannelquery.repository";
import { AttendanceChannelRepository } from "../repositories/attendancechannel.repository";
import { AttendanceChannelResolver } from "../graphql/attendancechannel.resolver";
import { AttendanceChannelAuthGuard } from "../guards/attendancechannelauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttendanceChannel } from "../entities/attendance-channel.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateAttendanceChannelHandler } from "../commands/handlers/createattendancechannel.handler";
import { UpdateAttendanceChannelHandler } from "../commands/handlers/updateattendancechannel.handler";
import { DeleteAttendanceChannelHandler } from "../commands/handlers/deleteattendancechannel.handler";
import { GetAttendanceChannelByIdHandler } from "../queries/handlers/getattendancechannelbyid.handler";
import { GetAttendanceChannelByFieldHandler } from "../queries/handlers/getattendancechannelbyfield.handler";
import { GetAllAttendanceChannelHandler } from "../queries/handlers/getallattendancechannel.handler";
import { AttendanceChannelCrudSaga } from "../sagas/attendancechannel-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { AttendanceChannelInterceptor } from "../interceptors/attendancechannel.interceptor";
import { AttendanceChannelLoggingInterceptor } from "../interceptors/attendancechannel.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, AttendanceChannel]), // Incluir BaseEntity para herencia
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
  controllers: [AttendanceChannelCommandController, AttendanceChannelQueryController],
  providers: [
    //Services
    EventStoreService,
    AttendanceChannelQueryService,
    AttendanceChannelCommandService,
  
    //Repositories
    AttendanceChannelCommandRepository,
    AttendanceChannelQueryRepository,
    AttendanceChannelRepository,      
    //Resolvers
    AttendanceChannelResolver,
    //Guards
    AttendanceChannelAuthGuard,
    //Interceptors
    AttendanceChannelInterceptor,
    AttendanceChannelLoggingInterceptor,
    //CQRS Handlers
    CreateAttendanceChannelHandler,
    UpdateAttendanceChannelHandler,
    DeleteAttendanceChannelHandler,
    GetAttendanceChannelByIdHandler,
    GetAttendanceChannelByFieldHandler,
    GetAllAttendanceChannelHandler,
    AttendanceChannelCrudSaga,
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
    AttendanceChannelQueryService,
    AttendanceChannelCommandService,
  
    //Repositories
    AttendanceChannelCommandRepository,
    AttendanceChannelQueryRepository,
    AttendanceChannelRepository,      
    //Resolvers
    AttendanceChannelResolver,
    //Guards
    AttendanceChannelAuthGuard,
    //Interceptors
    AttendanceChannelInterceptor,
    AttendanceChannelLoggingInterceptor,
  ],
})
export class AttendanceChannelModule {}

