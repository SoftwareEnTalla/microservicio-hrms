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
import { TrainingModalityCommandController } from "../controllers/trainingmodalitycommand.controller";
import { TrainingModalityQueryController } from "../controllers/trainingmodalityquery.controller";
import { TrainingModalityCommandService } from "../services/trainingmodalitycommand.service";
import { TrainingModalityQueryService } from "../services/trainingmodalityquery.service";

import { TrainingModalityCommandRepository } from "../repositories/trainingmodalitycommand.repository";
import { TrainingModalityQueryRepository } from "../repositories/trainingmodalityquery.repository";
import { TrainingModalityRepository } from "../repositories/trainingmodality.repository";
import { TrainingModalityResolver } from "../graphql/trainingmodality.resolver";
import { TrainingModalityAuthGuard } from "../guards/trainingmodalityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainingModality } from "../entities/training-modality.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTrainingModalityHandler } from "../commands/handlers/createtrainingmodality.handler";
import { UpdateTrainingModalityHandler } from "../commands/handlers/updatetrainingmodality.handler";
import { DeleteTrainingModalityHandler } from "../commands/handlers/deletetrainingmodality.handler";
import { GetTrainingModalityByIdHandler } from "../queries/handlers/gettrainingmodalitybyid.handler";
import { GetTrainingModalityByFieldHandler } from "../queries/handlers/gettrainingmodalitybyfield.handler";
import { GetAllTrainingModalityHandler } from "../queries/handlers/getalltrainingmodality.handler";
import { TrainingModalityCrudSaga } from "../sagas/trainingmodality-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TrainingModalityInterceptor } from "../interceptors/trainingmodality.interceptor";
import { TrainingModalityLoggingInterceptor } from "../interceptors/trainingmodality.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, TrainingModality]), // Incluir BaseEntity para herencia
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
  controllers: [TrainingModalityCommandController, TrainingModalityQueryController],
  providers: [
    //Services
    EventStoreService,
    TrainingModalityQueryService,
    TrainingModalityCommandService,
  
    //Repositories
    TrainingModalityCommandRepository,
    TrainingModalityQueryRepository,
    TrainingModalityRepository,      
    //Resolvers
    TrainingModalityResolver,
    //Guards
    TrainingModalityAuthGuard,
    //Interceptors
    TrainingModalityInterceptor,
    TrainingModalityLoggingInterceptor,
    //CQRS Handlers
    CreateTrainingModalityHandler,
    UpdateTrainingModalityHandler,
    DeleteTrainingModalityHandler,
    GetTrainingModalityByIdHandler,
    GetTrainingModalityByFieldHandler,
    GetAllTrainingModalityHandler,
    TrainingModalityCrudSaga,
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
    TrainingModalityQueryService,
    TrainingModalityCommandService,
  
    //Repositories
    TrainingModalityCommandRepository,
    TrainingModalityQueryRepository,
    TrainingModalityRepository,      
    //Resolvers
    TrainingModalityResolver,
    //Guards
    TrainingModalityAuthGuard,
    //Interceptors
    TrainingModalityInterceptor,
    TrainingModalityLoggingInterceptor,
  ],
})
export class TrainingModalityModule {}

