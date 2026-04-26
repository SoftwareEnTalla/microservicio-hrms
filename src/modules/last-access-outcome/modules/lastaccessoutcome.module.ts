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
import { LastAccessOutcomeCommandController } from "../controllers/lastaccessoutcomecommand.controller";
import { LastAccessOutcomeQueryController } from "../controllers/lastaccessoutcomequery.controller";
import { LastAccessOutcomeCommandService } from "../services/lastaccessoutcomecommand.service";
import { LastAccessOutcomeQueryService } from "../services/lastaccessoutcomequery.service";

import { LastAccessOutcomeCommandRepository } from "../repositories/lastaccessoutcomecommand.repository";
import { LastAccessOutcomeQueryRepository } from "../repositories/lastaccessoutcomequery.repository";
import { LastAccessOutcomeRepository } from "../repositories/lastaccessoutcome.repository";
import { LastAccessOutcomeResolver } from "../graphql/lastaccessoutcome.resolver";
import { LastAccessOutcomeAuthGuard } from "../guards/lastaccessoutcomeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LastAccessOutcome } from "../entities/last-access-outcome.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateLastAccessOutcomeHandler } from "../commands/handlers/createlastaccessoutcome.handler";
import { UpdateLastAccessOutcomeHandler } from "../commands/handlers/updatelastaccessoutcome.handler";
import { DeleteLastAccessOutcomeHandler } from "../commands/handlers/deletelastaccessoutcome.handler";
import { GetLastAccessOutcomeByIdHandler } from "../queries/handlers/getlastaccessoutcomebyid.handler";
import { GetLastAccessOutcomeByFieldHandler } from "../queries/handlers/getlastaccessoutcomebyfield.handler";
import { GetAllLastAccessOutcomeHandler } from "../queries/handlers/getalllastaccessoutcome.handler";
import { LastAccessOutcomeCrudSaga } from "../sagas/lastaccessoutcome-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { LastAccessOutcomeInterceptor } from "../interceptors/lastaccessoutcome.interceptor";
import { LastAccessOutcomeLoggingInterceptor } from "../interceptors/lastaccessoutcome.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, LastAccessOutcome]), // Incluir BaseEntity para herencia
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
  controllers: [LastAccessOutcomeCommandController, LastAccessOutcomeQueryController],
  providers: [
    //Services
    EventStoreService,
    LastAccessOutcomeQueryService,
    LastAccessOutcomeCommandService,
  
    //Repositories
    LastAccessOutcomeCommandRepository,
    LastAccessOutcomeQueryRepository,
    LastAccessOutcomeRepository,      
    //Resolvers
    LastAccessOutcomeResolver,
    //Guards
    LastAccessOutcomeAuthGuard,
    //Interceptors
    LastAccessOutcomeInterceptor,
    LastAccessOutcomeLoggingInterceptor,
    //CQRS Handlers
    CreateLastAccessOutcomeHandler,
    UpdateLastAccessOutcomeHandler,
    DeleteLastAccessOutcomeHandler,
    GetLastAccessOutcomeByIdHandler,
    GetLastAccessOutcomeByFieldHandler,
    GetAllLastAccessOutcomeHandler,
    LastAccessOutcomeCrudSaga,
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
    LastAccessOutcomeQueryService,
    LastAccessOutcomeCommandService,
  
    //Repositories
    LastAccessOutcomeCommandRepository,
    LastAccessOutcomeQueryRepository,
    LastAccessOutcomeRepository,      
    //Resolvers
    LastAccessOutcomeResolver,
    //Guards
    LastAccessOutcomeAuthGuard,
    //Interceptors
    LastAccessOutcomeInterceptor,
    LastAccessOutcomeLoggingInterceptor,
  ],
})
export class LastAccessOutcomeModule {}

