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
import { ConfigurationParameterCommandController } from "../controllers/configurationparametercommand.controller";
import { ConfigurationParameterQueryController } from "../controllers/configurationparameterquery.controller";
import { ConfigurationParameterCommandService } from "../services/configurationparametercommand.service";
import { ConfigurationParameterQueryService } from "../services/configurationparameterquery.service";

import { ConfigurationParameterCommandRepository } from "../repositories/configurationparametercommand.repository";
import { ConfigurationParameterQueryRepository } from "../repositories/configurationparameterquery.repository";
import { ConfigurationParameterRepository } from "../repositories/configurationparameter.repository";
import { ConfigurationParameterResolver } from "../graphql/configurationparameter.resolver";
import { ConfigurationParameterAuthGuard } from "../guards/configurationparameterauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigurationParameter } from "../entities/configuration-parameter.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateConfigurationParameterHandler } from "../commands/handlers/createconfigurationparameter.handler";
import { UpdateConfigurationParameterHandler } from "../commands/handlers/updateconfigurationparameter.handler";
import { DeleteConfigurationParameterHandler } from "../commands/handlers/deleteconfigurationparameter.handler";
import { GetConfigurationParameterByIdHandler } from "../queries/handlers/getconfigurationparameterbyid.handler";
import { GetConfigurationParameterByFieldHandler } from "../queries/handlers/getconfigurationparameterbyfield.handler";
import { GetAllConfigurationParameterHandler } from "../queries/handlers/getallconfigurationparameter.handler";
import { ConfigurationParameterCrudSaga } from "../sagas/configurationparameter-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ConfigurationParameterInterceptor } from "../interceptors/configurationparameter.interceptor";
import { ConfigurationParameterLoggingInterceptor } from "../interceptors/configurationparameter.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ConfigurationParameter]), // Incluir BaseEntity para herencia
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
  controllers: [ConfigurationParameterCommandController, ConfigurationParameterQueryController],
  providers: [
    //Services
    EventStoreService,
    ConfigurationParameterQueryService,
    ConfigurationParameterCommandService,
  
    //Repositories
    ConfigurationParameterCommandRepository,
    ConfigurationParameterQueryRepository,
    ConfigurationParameterRepository,      
    //Resolvers
    ConfigurationParameterResolver,
    //Guards
    ConfigurationParameterAuthGuard,
    //Interceptors
    ConfigurationParameterInterceptor,
    ConfigurationParameterLoggingInterceptor,
    //CQRS Handlers
    CreateConfigurationParameterHandler,
    UpdateConfigurationParameterHandler,
    DeleteConfigurationParameterHandler,
    GetConfigurationParameterByIdHandler,
    GetConfigurationParameterByFieldHandler,
    GetAllConfigurationParameterHandler,
    ConfigurationParameterCrudSaga,
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
    ConfigurationParameterQueryService,
    ConfigurationParameterCommandService,
  
    //Repositories
    ConfigurationParameterCommandRepository,
    ConfigurationParameterQueryRepository,
    ConfigurationParameterRepository,      
    //Resolvers
    ConfigurationParameterResolver,
    //Guards
    ConfigurationParameterAuthGuard,
    //Interceptors
    ConfigurationParameterInterceptor,
    ConfigurationParameterLoggingInterceptor,
  ],
})
export class ConfigurationParameterModule {}

