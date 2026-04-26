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
import { AccessCredentialTypeCommandController } from "../controllers/accesscredentialtypecommand.controller";
import { AccessCredentialTypeQueryController } from "../controllers/accesscredentialtypequery.controller";
import { AccessCredentialTypeCommandService } from "../services/accesscredentialtypecommand.service";
import { AccessCredentialTypeQueryService } from "../services/accesscredentialtypequery.service";

import { AccessCredentialTypeCommandRepository } from "../repositories/accesscredentialtypecommand.repository";
import { AccessCredentialTypeQueryRepository } from "../repositories/accesscredentialtypequery.repository";
import { AccessCredentialTypeRepository } from "../repositories/accesscredentialtype.repository";
import { AccessCredentialTypeResolver } from "../graphql/accesscredentialtype.resolver";
import { AccessCredentialTypeAuthGuard } from "../guards/accesscredentialtypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccessCredentialType } from "../entities/access-credential-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateAccessCredentialTypeHandler } from "../commands/handlers/createaccesscredentialtype.handler";
import { UpdateAccessCredentialTypeHandler } from "../commands/handlers/updateaccesscredentialtype.handler";
import { DeleteAccessCredentialTypeHandler } from "../commands/handlers/deleteaccesscredentialtype.handler";
import { GetAccessCredentialTypeByIdHandler } from "../queries/handlers/getaccesscredentialtypebyid.handler";
import { GetAccessCredentialTypeByFieldHandler } from "../queries/handlers/getaccesscredentialtypebyfield.handler";
import { GetAllAccessCredentialTypeHandler } from "../queries/handlers/getallaccesscredentialtype.handler";
import { AccessCredentialTypeCrudSaga } from "../sagas/accesscredentialtype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { AccessCredentialTypeInterceptor } from "../interceptors/accesscredentialtype.interceptor";
import { AccessCredentialTypeLoggingInterceptor } from "../interceptors/accesscredentialtype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, AccessCredentialType]), // Incluir BaseEntity para herencia
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
  controllers: [AccessCredentialTypeCommandController, AccessCredentialTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    AccessCredentialTypeQueryService,
    AccessCredentialTypeCommandService,
  
    //Repositories
    AccessCredentialTypeCommandRepository,
    AccessCredentialTypeQueryRepository,
    AccessCredentialTypeRepository,      
    //Resolvers
    AccessCredentialTypeResolver,
    //Guards
    AccessCredentialTypeAuthGuard,
    //Interceptors
    AccessCredentialTypeInterceptor,
    AccessCredentialTypeLoggingInterceptor,
    //CQRS Handlers
    CreateAccessCredentialTypeHandler,
    UpdateAccessCredentialTypeHandler,
    DeleteAccessCredentialTypeHandler,
    GetAccessCredentialTypeByIdHandler,
    GetAccessCredentialTypeByFieldHandler,
    GetAllAccessCredentialTypeHandler,
    AccessCredentialTypeCrudSaga,
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
    AccessCredentialTypeQueryService,
    AccessCredentialTypeCommandService,
  
    //Repositories
    AccessCredentialTypeCommandRepository,
    AccessCredentialTypeQueryRepository,
    AccessCredentialTypeRepository,      
    //Resolvers
    AccessCredentialTypeResolver,
    //Guards
    AccessCredentialTypeAuthGuard,
    //Interceptors
    AccessCredentialTypeInterceptor,
    AccessCredentialTypeLoggingInterceptor,
  ],
})
export class AccessCredentialTypeModule {}

