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
import { AttendanceCommandController } from "../controllers/attendancecommand.controller";
import { AttendanceQueryController } from "../controllers/attendancequery.controller";
import { AttendanceCommandService } from "../services/attendancecommand.service";
import { AttendanceQueryService } from "../services/attendancequery.service";

import { AttendanceCommandRepository } from "../repositories/attendancecommand.repository";
import { AttendanceQueryRepository } from "../repositories/attendancequery.repository";
import { AttendanceRepository } from "../repositories/attendance.repository";
import { AttendanceResolver } from "../graphql/attendance.resolver";
import { AttendanceAuthGuard } from "../guards/attendanceauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateAttendanceHandler } from "../commands/handlers/createattendance.handler";
import { UpdateAttendanceHandler } from "../commands/handlers/updateattendance.handler";
import { DeleteAttendanceHandler } from "../commands/handlers/deleteattendance.handler";
import { GetAttendanceByIdHandler } from "../queries/handlers/getattendancebyid.handler";
import { GetAttendanceByFieldHandler } from "../queries/handlers/getattendancebyfield.handler";
import { GetAllAttendanceHandler } from "../queries/handlers/getallattendance.handler";
import { AttendanceCrudSaga } from "../sagas/attendance-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { AttendanceInterceptor } from "../interceptors/attendance.interceptor";
import { AttendanceLoggingInterceptor } from "../interceptors/attendance.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Attendance]), // Incluir BaseEntity para herencia
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
  controllers: [AttendanceCommandController, AttendanceQueryController],
  providers: [
    //Services
    EventStoreService,
    AttendanceQueryService,
    AttendanceCommandService,
  
    //Repositories
    AttendanceCommandRepository,
    AttendanceQueryRepository,
    AttendanceRepository,      
    //Resolvers
    AttendanceResolver,
    //Guards
    AttendanceAuthGuard,
    //Interceptors
    AttendanceInterceptor,
    AttendanceLoggingInterceptor,
    //CQRS Handlers
    CreateAttendanceHandler,
    UpdateAttendanceHandler,
    DeleteAttendanceHandler,
    GetAttendanceByIdHandler,
    GetAttendanceByFieldHandler,
    GetAllAttendanceHandler,
    AttendanceCrudSaga,
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
    AttendanceQueryService,
    AttendanceCommandService,
  
    //Repositories
    AttendanceCommandRepository,
    AttendanceQueryRepository,
    AttendanceRepository,      
    //Resolvers
    AttendanceResolver,
    //Guards
    AttendanceAuthGuard,
    //Interceptors
    AttendanceInterceptor,
    AttendanceLoggingInterceptor,
  ],
})
export class AttendanceModule {}

