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
import { GenderCommandController } from "../controllers/gendercommand.controller";
import { GenderQueryController } from "../controllers/genderquery.controller";
import { GenderCommandService } from "../services/gendercommand.service";
import { GenderQueryService } from "../services/genderquery.service";

import { GenderCommandRepository } from "../repositories/gendercommand.repository";
import { GenderQueryRepository } from "../repositories/genderquery.repository";
import { GenderRepository } from "../repositories/gender.repository";
import { GenderResolver } from "../graphql/gender.resolver";
import { GenderAuthGuard } from "../guards/genderauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gender } from "../entities/gender.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateGenderHandler } from "../commands/handlers/creategender.handler";
import { UpdateGenderHandler } from "../commands/handlers/updategender.handler";
import { DeleteGenderHandler } from "../commands/handlers/deletegender.handler";
import { GetGenderByIdHandler } from "../queries/handlers/getgenderbyid.handler";
import { GetGenderByFieldHandler } from "../queries/handlers/getgenderbyfield.handler";
import { GetAllGenderHandler } from "../queries/handlers/getallgender.handler";
import { GenderCrudSaga } from "../sagas/gender-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { GenderInterceptor } from "../interceptors/gender.interceptor";
import { GenderLoggingInterceptor } from "../interceptors/gender.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Gender]), // Incluir BaseEntity para herencia
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
  controllers: [GenderCommandController, GenderQueryController],
  providers: [
    //Services
    EventStoreService,
    GenderQueryService,
    GenderCommandService,
  
    //Repositories
    GenderCommandRepository,
    GenderQueryRepository,
    GenderRepository,      
    //Resolvers
    GenderResolver,
    //Guards
    GenderAuthGuard,
    //Interceptors
    GenderInterceptor,
    GenderLoggingInterceptor,
    //CQRS Handlers
    CreateGenderHandler,
    UpdateGenderHandler,
    DeleteGenderHandler,
    GetGenderByIdHandler,
    GetGenderByFieldHandler,
    GetAllGenderHandler,
    GenderCrudSaga,
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
    GenderQueryService,
    GenderCommandService,
  
    //Repositories
    GenderCommandRepository,
    GenderQueryRepository,
    GenderRepository,      
    //Resolvers
    GenderResolver,
    //Guards
    GenderAuthGuard,
    //Interceptors
    GenderInterceptor,
    GenderLoggingInterceptor,
  ],
})
export class GenderModule {}

