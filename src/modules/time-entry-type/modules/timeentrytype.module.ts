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
import { TimeEntryTypeCommandController } from "../controllers/timeentrytypecommand.controller";
import { TimeEntryTypeQueryController } from "../controllers/timeentrytypequery.controller";
import { TimeEntryTypeCommandService } from "../services/timeentrytypecommand.service";
import { TimeEntryTypeQueryService } from "../services/timeentrytypequery.service";

import { TimeEntryTypeCommandRepository } from "../repositories/timeentrytypecommand.repository";
import { TimeEntryTypeQueryRepository } from "../repositories/timeentrytypequery.repository";
import { TimeEntryTypeRepository } from "../repositories/timeentrytype.repository";
import { TimeEntryTypeResolver } from "../graphql/timeentrytype.resolver";
import { TimeEntryTypeAuthGuard } from "../guards/timeentrytypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeEntryType } from "../entities/time-entry-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTimeEntryTypeHandler } from "../commands/handlers/createtimeentrytype.handler";
import { UpdateTimeEntryTypeHandler } from "../commands/handlers/updatetimeentrytype.handler";
import { DeleteTimeEntryTypeHandler } from "../commands/handlers/deletetimeentrytype.handler";
import { GetTimeEntryTypeByIdHandler } from "../queries/handlers/gettimeentrytypebyid.handler";
import { GetTimeEntryTypeByFieldHandler } from "../queries/handlers/gettimeentrytypebyfield.handler";
import { GetAllTimeEntryTypeHandler } from "../queries/handlers/getalltimeentrytype.handler";
import { TimeEntryTypeCrudSaga } from "../sagas/timeentrytype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TimeEntryTypeInterceptor } from "../interceptors/timeentrytype.interceptor";
import { TimeEntryTypeLoggingInterceptor } from "../interceptors/timeentrytype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, TimeEntryType]), // Incluir BaseEntity para herencia
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
  controllers: [TimeEntryTypeCommandController, TimeEntryTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    TimeEntryTypeQueryService,
    TimeEntryTypeCommandService,
  
    //Repositories
    TimeEntryTypeCommandRepository,
    TimeEntryTypeQueryRepository,
    TimeEntryTypeRepository,      
    //Resolvers
    TimeEntryTypeResolver,
    //Guards
    TimeEntryTypeAuthGuard,
    //Interceptors
    TimeEntryTypeInterceptor,
    TimeEntryTypeLoggingInterceptor,
    //CQRS Handlers
    CreateTimeEntryTypeHandler,
    UpdateTimeEntryTypeHandler,
    DeleteTimeEntryTypeHandler,
    GetTimeEntryTypeByIdHandler,
    GetTimeEntryTypeByFieldHandler,
    GetAllTimeEntryTypeHandler,
    TimeEntryTypeCrudSaga,
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
    TimeEntryTypeQueryService,
    TimeEntryTypeCommandService,
  
    //Repositories
    TimeEntryTypeCommandRepository,
    TimeEntryTypeQueryRepository,
    TimeEntryTypeRepository,      
    //Resolvers
    TimeEntryTypeResolver,
    //Guards
    TimeEntryTypeAuthGuard,
    //Interceptors
    TimeEntryTypeInterceptor,
    TimeEntryTypeLoggingInterceptor,
  ],
})
export class TimeEntryTypeModule {}

