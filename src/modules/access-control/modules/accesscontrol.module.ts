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
import { AccessControlCommandController } from "../controllers/accesscontrolcommand.controller";
import { AccessControlQueryController } from "../controllers/accesscontrolquery.controller";
import { AccessControlCommandService } from "../services/accesscontrolcommand.service";
import { AccessControlQueryService } from "../services/accesscontrolquery.service";

import { AccessControlCommandRepository } from "../repositories/accesscontrolcommand.repository";
import { AccessControlQueryRepository } from "../repositories/accesscontrolquery.repository";
import { AccessControlRepository } from "../repositories/accesscontrol.repository";
import { AccessControlResolver } from "../graphql/accesscontrol.resolver";
import { AccessControlAuthGuard } from "../guards/accesscontrolauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccessControl } from "../entities/access-control.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateAccessControlHandler } from "../commands/handlers/createaccesscontrol.handler";
import { UpdateAccessControlHandler } from "../commands/handlers/updateaccesscontrol.handler";
import { DeleteAccessControlHandler } from "../commands/handlers/deleteaccesscontrol.handler";
import { GetAccessControlByIdHandler } from "../queries/handlers/getaccesscontrolbyid.handler";
import { GetAccessControlByFieldHandler } from "../queries/handlers/getaccesscontrolbyfield.handler";
import { GetAllAccessControlHandler } from "../queries/handlers/getallaccesscontrol.handler";
import { AccessControlCrudSaga } from "../sagas/accesscontrol-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { AccessControlInterceptor } from "../interceptors/accesscontrol.interceptor";
import { AccessControlLoggingInterceptor } from "../interceptors/accesscontrol.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, AccessControl]), // Incluir BaseEntity para herencia
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
  controllers: [AccessControlCommandController, AccessControlQueryController],
  providers: [
    //Services
    EventStoreService,
    AccessControlQueryService,
    AccessControlCommandService,
  
    //Repositories
    AccessControlCommandRepository,
    AccessControlQueryRepository,
    AccessControlRepository,      
    //Resolvers
    AccessControlResolver,
    //Guards
    AccessControlAuthGuard,
    //Interceptors
    AccessControlInterceptor,
    AccessControlLoggingInterceptor,
    //CQRS Handlers
    CreateAccessControlHandler,
    UpdateAccessControlHandler,
    DeleteAccessControlHandler,
    GetAccessControlByIdHandler,
    GetAccessControlByFieldHandler,
    GetAllAccessControlHandler,
    AccessControlCrudSaga,
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
    AccessControlQueryService,
    AccessControlCommandService,
  
    //Repositories
    AccessControlCommandRepository,
    AccessControlQueryRepository,
    AccessControlRepository,      
    //Resolvers
    AccessControlResolver,
    //Guards
    AccessControlAuthGuard,
    //Interceptors
    AccessControlInterceptor,
    AccessControlLoggingInterceptor,
  ],
})
export class AccessControlModule {}

