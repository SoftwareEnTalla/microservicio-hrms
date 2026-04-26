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
import { ScopeTypeCommandController } from "../controllers/scopetypecommand.controller";
import { ScopeTypeQueryController } from "../controllers/scopetypequery.controller";
import { ScopeTypeCommandService } from "../services/scopetypecommand.service";
import { ScopeTypeQueryService } from "../services/scopetypequery.service";

import { ScopeTypeCommandRepository } from "../repositories/scopetypecommand.repository";
import { ScopeTypeQueryRepository } from "../repositories/scopetypequery.repository";
import { ScopeTypeRepository } from "../repositories/scopetype.repository";
import { ScopeTypeResolver } from "../graphql/scopetype.resolver";
import { ScopeTypeAuthGuard } from "../guards/scopetypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScopeType } from "../entities/scope-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateScopeTypeHandler } from "../commands/handlers/createscopetype.handler";
import { UpdateScopeTypeHandler } from "../commands/handlers/updatescopetype.handler";
import { DeleteScopeTypeHandler } from "../commands/handlers/deletescopetype.handler";
import { GetScopeTypeByIdHandler } from "../queries/handlers/getscopetypebyid.handler";
import { GetScopeTypeByFieldHandler } from "../queries/handlers/getscopetypebyfield.handler";
import { GetAllScopeTypeHandler } from "../queries/handlers/getallscopetype.handler";
import { ScopeTypeCrudSaga } from "../sagas/scopetype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ScopeTypeInterceptor } from "../interceptors/scopetype.interceptor";
import { ScopeTypeLoggingInterceptor } from "../interceptors/scopetype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ScopeType]), // Incluir BaseEntity para herencia
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
  controllers: [ScopeTypeCommandController, ScopeTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    ScopeTypeQueryService,
    ScopeTypeCommandService,
  
    //Repositories
    ScopeTypeCommandRepository,
    ScopeTypeQueryRepository,
    ScopeTypeRepository,      
    //Resolvers
    ScopeTypeResolver,
    //Guards
    ScopeTypeAuthGuard,
    //Interceptors
    ScopeTypeInterceptor,
    ScopeTypeLoggingInterceptor,
    //CQRS Handlers
    CreateScopeTypeHandler,
    UpdateScopeTypeHandler,
    DeleteScopeTypeHandler,
    GetScopeTypeByIdHandler,
    GetScopeTypeByFieldHandler,
    GetAllScopeTypeHandler,
    ScopeTypeCrudSaga,
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
    ScopeTypeQueryService,
    ScopeTypeCommandService,
  
    //Repositories
    ScopeTypeCommandRepository,
    ScopeTypeQueryRepository,
    ScopeTypeRepository,      
    //Resolvers
    ScopeTypeResolver,
    //Guards
    ScopeTypeAuthGuard,
    //Interceptors
    ScopeTypeInterceptor,
    ScopeTypeLoggingInterceptor,
  ],
})
export class ScopeTypeModule {}

