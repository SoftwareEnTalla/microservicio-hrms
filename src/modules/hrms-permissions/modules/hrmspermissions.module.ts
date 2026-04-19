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
import { HrmsPermissionsCommandController } from "../controllers/hrmspermissionscommand.controller";
import { HrmsPermissionsQueryController } from "../controllers/hrmspermissionsquery.controller";
import { HrmsPermissionsCommandService } from "../services/hrmspermissionscommand.service";
import { HrmsPermissionsQueryService } from "../services/hrmspermissionsquery.service";

import { HrmsPermissionsCommandRepository } from "../repositories/hrmspermissionscommand.repository";
import { HrmsPermissionsQueryRepository } from "../repositories/hrmspermissionsquery.repository";
import { HrmsPermissionsRepository } from "../repositories/hrmspermissions.repository";
import { HrmsPermissionsResolver } from "../graphql/hrmspermissions.resolver";
import { HrmsPermissionsAuthGuard } from "../guards/hrmspermissionsauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HrmsPermissions } from "../entities/hrms-permissions.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateHrmsPermissionsHandler } from "../commands/handlers/createhrmspermissions.handler";
import { UpdateHrmsPermissionsHandler } from "../commands/handlers/updatehrmspermissions.handler";
import { DeleteHrmsPermissionsHandler } from "../commands/handlers/deletehrmspermissions.handler";
import { GetHrmsPermissionsByIdHandler } from "../queries/handlers/gethrmspermissionsbyid.handler";
import { GetHrmsPermissionsByFieldHandler } from "../queries/handlers/gethrmspermissionsbyfield.handler";
import { GetAllHrmsPermissionsHandler } from "../queries/handlers/getallhrmspermissions.handler";
import { HrmsPermissionsCrudSaga } from "../sagas/hrmspermissions-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { HrmsPermissionsInterceptor } from "../interceptors/hrmspermissions.interceptor";
import { HrmsPermissionsLoggingInterceptor } from "../interceptors/hrmspermissions.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, HrmsPermissions]), // Incluir BaseEntity para herencia
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
  controllers: [HrmsPermissionsCommandController, HrmsPermissionsQueryController],
  providers: [
    //Services
    EventStoreService,
    HrmsPermissionsQueryService,
    HrmsPermissionsCommandService,
  
    //Repositories
    HrmsPermissionsCommandRepository,
    HrmsPermissionsQueryRepository,
    HrmsPermissionsRepository,      
    //Resolvers
    HrmsPermissionsResolver,
    //Guards
    HrmsPermissionsAuthGuard,
    //Interceptors
    HrmsPermissionsInterceptor,
    HrmsPermissionsLoggingInterceptor,
    //CQRS Handlers
    CreateHrmsPermissionsHandler,
    UpdateHrmsPermissionsHandler,
    DeleteHrmsPermissionsHandler,
    GetHrmsPermissionsByIdHandler,
    GetHrmsPermissionsByFieldHandler,
    GetAllHrmsPermissionsHandler,
    HrmsPermissionsCrudSaga,
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
    HrmsPermissionsQueryService,
    HrmsPermissionsCommandService,
  
    //Repositories
    HrmsPermissionsCommandRepository,
    HrmsPermissionsQueryRepository,
    HrmsPermissionsRepository,      
    //Resolvers
    HrmsPermissionsResolver,
    //Guards
    HrmsPermissionsAuthGuard,
    //Interceptors
    HrmsPermissionsInterceptor,
    HrmsPermissionsLoggingInterceptor,
  ],
})
export class HrmsPermissionsModule {}

