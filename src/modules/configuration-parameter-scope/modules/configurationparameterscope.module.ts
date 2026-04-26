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
import { ConfigurationParameterScopeCommandController } from "../controllers/configurationparameterscopecommand.controller";
import { ConfigurationParameterScopeQueryController } from "../controllers/configurationparameterscopequery.controller";
import { ConfigurationParameterScopeCommandService } from "../services/configurationparameterscopecommand.service";
import { ConfigurationParameterScopeQueryService } from "../services/configurationparameterscopequery.service";

import { ConfigurationParameterScopeCommandRepository } from "../repositories/configurationparameterscopecommand.repository";
import { ConfigurationParameterScopeQueryRepository } from "../repositories/configurationparameterscopequery.repository";
import { ConfigurationParameterScopeRepository } from "../repositories/configurationparameterscope.repository";
import { ConfigurationParameterScopeResolver } from "../graphql/configurationparameterscope.resolver";
import { ConfigurationParameterScopeAuthGuard } from "../guards/configurationparameterscopeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigurationParameterScope } from "../entities/configuration-parameter-scope.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateConfigurationParameterScopeHandler } from "../commands/handlers/createconfigurationparameterscope.handler";
import { UpdateConfigurationParameterScopeHandler } from "../commands/handlers/updateconfigurationparameterscope.handler";
import { DeleteConfigurationParameterScopeHandler } from "../commands/handlers/deleteconfigurationparameterscope.handler";
import { GetConfigurationParameterScopeByIdHandler } from "../queries/handlers/getconfigurationparameterscopebyid.handler";
import { GetConfigurationParameterScopeByFieldHandler } from "../queries/handlers/getconfigurationparameterscopebyfield.handler";
import { GetAllConfigurationParameterScopeHandler } from "../queries/handlers/getallconfigurationparameterscope.handler";
import { ConfigurationParameterScopeCrudSaga } from "../sagas/configurationparameterscope-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ConfigurationParameterScopeInterceptor } from "../interceptors/configurationparameterscope.interceptor";
import { ConfigurationParameterScopeLoggingInterceptor } from "../interceptors/configurationparameterscope.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ConfigurationParameterScope]), // Incluir BaseEntity para herencia
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
  controllers: [ConfigurationParameterScopeCommandController, ConfigurationParameterScopeQueryController],
  providers: [
    //Services
    EventStoreService,
    ConfigurationParameterScopeQueryService,
    ConfigurationParameterScopeCommandService,
  
    //Repositories
    ConfigurationParameterScopeCommandRepository,
    ConfigurationParameterScopeQueryRepository,
    ConfigurationParameterScopeRepository,      
    //Resolvers
    ConfigurationParameterScopeResolver,
    //Guards
    ConfigurationParameterScopeAuthGuard,
    //Interceptors
    ConfigurationParameterScopeInterceptor,
    ConfigurationParameterScopeLoggingInterceptor,
    //CQRS Handlers
    CreateConfigurationParameterScopeHandler,
    UpdateConfigurationParameterScopeHandler,
    DeleteConfigurationParameterScopeHandler,
    GetConfigurationParameterScopeByIdHandler,
    GetConfigurationParameterScopeByFieldHandler,
    GetAllConfigurationParameterScopeHandler,
    ConfigurationParameterScopeCrudSaga,
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
    ConfigurationParameterScopeQueryService,
    ConfigurationParameterScopeCommandService,
  
    //Repositories
    ConfigurationParameterScopeCommandRepository,
    ConfigurationParameterScopeQueryRepository,
    ConfigurationParameterScopeRepository,      
    //Resolvers
    ConfigurationParameterScopeResolver,
    //Guards
    ConfigurationParameterScopeAuthGuard,
    //Interceptors
    ConfigurationParameterScopeInterceptor,
    ConfigurationParameterScopeLoggingInterceptor,
  ],
})
export class ConfigurationParameterScopeModule {}

