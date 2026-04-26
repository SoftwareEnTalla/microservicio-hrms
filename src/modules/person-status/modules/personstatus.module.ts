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
import { PersonStatusCommandController } from "../controllers/personstatuscommand.controller";
import { PersonStatusQueryController } from "../controllers/personstatusquery.controller";
import { PersonStatusCommandService } from "../services/personstatuscommand.service";
import { PersonStatusQueryService } from "../services/personstatusquery.service";

import { PersonStatusCommandRepository } from "../repositories/personstatuscommand.repository";
import { PersonStatusQueryRepository } from "../repositories/personstatusquery.repository";
import { PersonStatusRepository } from "../repositories/personstatus.repository";
import { PersonStatusResolver } from "../graphql/personstatus.resolver";
import { PersonStatusAuthGuard } from "../guards/personstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonStatus } from "../entities/person-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePersonStatusHandler } from "../commands/handlers/createpersonstatus.handler";
import { UpdatePersonStatusHandler } from "../commands/handlers/updatepersonstatus.handler";
import { DeletePersonStatusHandler } from "../commands/handlers/deletepersonstatus.handler";
import { GetPersonStatusByIdHandler } from "../queries/handlers/getpersonstatusbyid.handler";
import { GetPersonStatusByFieldHandler } from "../queries/handlers/getpersonstatusbyfield.handler";
import { GetAllPersonStatusHandler } from "../queries/handlers/getallpersonstatus.handler";
import { PersonStatusCrudSaga } from "../sagas/personstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PersonStatusInterceptor } from "../interceptors/personstatus.interceptor";
import { PersonStatusLoggingInterceptor } from "../interceptors/personstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PersonStatus]), // Incluir BaseEntity para herencia
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
  controllers: [PersonStatusCommandController, PersonStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    PersonStatusQueryService,
    PersonStatusCommandService,
  
    //Repositories
    PersonStatusCommandRepository,
    PersonStatusQueryRepository,
    PersonStatusRepository,      
    //Resolvers
    PersonStatusResolver,
    //Guards
    PersonStatusAuthGuard,
    //Interceptors
    PersonStatusInterceptor,
    PersonStatusLoggingInterceptor,
    //CQRS Handlers
    CreatePersonStatusHandler,
    UpdatePersonStatusHandler,
    DeletePersonStatusHandler,
    GetPersonStatusByIdHandler,
    GetPersonStatusByFieldHandler,
    GetAllPersonStatusHandler,
    PersonStatusCrudSaga,
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
    PersonStatusQueryService,
    PersonStatusCommandService,
  
    //Repositories
    PersonStatusCommandRepository,
    PersonStatusQueryRepository,
    PersonStatusRepository,      
    //Resolvers
    PersonStatusResolver,
    //Guards
    PersonStatusAuthGuard,
    //Interceptors
    PersonStatusInterceptor,
    PersonStatusLoggingInterceptor,
  ],
})
export class PersonStatusModule {}

