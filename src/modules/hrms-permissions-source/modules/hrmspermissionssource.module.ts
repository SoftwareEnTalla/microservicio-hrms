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
import { HrmsPermissionsSourceCommandController } from "../controllers/hrmspermissionssourcecommand.controller";
import { HrmsPermissionsSourceQueryController } from "../controllers/hrmspermissionssourcequery.controller";
import { HrmsPermissionsSourceCommandService } from "../services/hrmspermissionssourcecommand.service";
import { HrmsPermissionsSourceQueryService } from "../services/hrmspermissionssourcequery.service";

import { HrmsPermissionsSourceCommandRepository } from "../repositories/hrmspermissionssourcecommand.repository";
import { HrmsPermissionsSourceQueryRepository } from "../repositories/hrmspermissionssourcequery.repository";
import { HrmsPermissionsSourceRepository } from "../repositories/hrmspermissionssource.repository";
import { HrmsPermissionsSourceResolver } from "../graphql/hrmspermissionssource.resolver";
import { HrmsPermissionsSourceAuthGuard } from "../guards/hrmspermissionssourceauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HrmsPermissionsSource } from "../entities/hrms-permissions-source.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateHrmsPermissionsSourceHandler } from "../commands/handlers/createhrmspermissionssource.handler";
import { UpdateHrmsPermissionsSourceHandler } from "../commands/handlers/updatehrmspermissionssource.handler";
import { DeleteHrmsPermissionsSourceHandler } from "../commands/handlers/deletehrmspermissionssource.handler";
import { GetHrmsPermissionsSourceByIdHandler } from "../queries/handlers/gethrmspermissionssourcebyid.handler";
import { GetHrmsPermissionsSourceByFieldHandler } from "../queries/handlers/gethrmspermissionssourcebyfield.handler";
import { GetAllHrmsPermissionsSourceHandler } from "../queries/handlers/getallhrmspermissionssource.handler";
import { HrmsPermissionsSourceCrudSaga } from "../sagas/hrmspermissionssource-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { HrmsPermissionsSourceInterceptor } from "../interceptors/hrmspermissionssource.interceptor";
import { HrmsPermissionsSourceLoggingInterceptor } from "../interceptors/hrmspermissionssource.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, HrmsPermissionsSource]), // Incluir BaseEntity para herencia
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
  controllers: [HrmsPermissionsSourceCommandController, HrmsPermissionsSourceQueryController],
  providers: [
    //Services
    EventStoreService,
    HrmsPermissionsSourceQueryService,
    HrmsPermissionsSourceCommandService,
  
    //Repositories
    HrmsPermissionsSourceCommandRepository,
    HrmsPermissionsSourceQueryRepository,
    HrmsPermissionsSourceRepository,      
    //Resolvers
    HrmsPermissionsSourceResolver,
    //Guards
    HrmsPermissionsSourceAuthGuard,
    //Interceptors
    HrmsPermissionsSourceInterceptor,
    HrmsPermissionsSourceLoggingInterceptor,
    //CQRS Handlers
    CreateHrmsPermissionsSourceHandler,
    UpdateHrmsPermissionsSourceHandler,
    DeleteHrmsPermissionsSourceHandler,
    GetHrmsPermissionsSourceByIdHandler,
    GetHrmsPermissionsSourceByFieldHandler,
    GetAllHrmsPermissionsSourceHandler,
    HrmsPermissionsSourceCrudSaga,
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
    HrmsPermissionsSourceQueryService,
    HrmsPermissionsSourceCommandService,
  
    //Repositories
    HrmsPermissionsSourceCommandRepository,
    HrmsPermissionsSourceQueryRepository,
    HrmsPermissionsSourceRepository,      
    //Resolvers
    HrmsPermissionsSourceResolver,
    //Guards
    HrmsPermissionsSourceAuthGuard,
    //Interceptors
    HrmsPermissionsSourceInterceptor,
    HrmsPermissionsSourceLoggingInterceptor,
  ],
})
export class HrmsPermissionsSourceModule {}

