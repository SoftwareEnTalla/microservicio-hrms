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
import { TrainingCommandController } from "../controllers/trainingcommand.controller";
import { TrainingQueryController } from "../controllers/trainingquery.controller";
import { TrainingCommandService } from "../services/trainingcommand.service";
import { TrainingQueryService } from "../services/trainingquery.service";

import { TrainingCommandRepository } from "../repositories/trainingcommand.repository";
import { TrainingQueryRepository } from "../repositories/trainingquery.repository";
import { TrainingRepository } from "../repositories/training.repository";
import { TrainingResolver } from "../graphql/training.resolver";
import { TrainingAuthGuard } from "../guards/trainingauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Training } from "../entities/training.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTrainingHandler } from "../commands/handlers/createtraining.handler";
import { UpdateTrainingHandler } from "../commands/handlers/updatetraining.handler";
import { DeleteTrainingHandler } from "../commands/handlers/deletetraining.handler";
import { GetTrainingByIdHandler } from "../queries/handlers/gettrainingbyid.handler";
import { GetTrainingByFieldHandler } from "../queries/handlers/gettrainingbyfield.handler";
import { GetAllTrainingHandler } from "../queries/handlers/getalltraining.handler";
import { TrainingCrudSaga } from "../sagas/training-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TrainingInterceptor } from "../interceptors/training.interceptor";
import { TrainingLoggingInterceptor } from "../interceptors/training.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Training]), // Incluir BaseEntity para herencia
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
  controllers: [TrainingCommandController, TrainingQueryController],
  providers: [
    //Services
    EventStoreService,
    TrainingQueryService,
    TrainingCommandService,
  
    //Repositories
    TrainingCommandRepository,
    TrainingQueryRepository,
    TrainingRepository,      
    //Resolvers
    TrainingResolver,
    //Guards
    TrainingAuthGuard,
    //Interceptors
    TrainingInterceptor,
    TrainingLoggingInterceptor,
    //CQRS Handlers
    CreateTrainingHandler,
    UpdateTrainingHandler,
    DeleteTrainingHandler,
    GetTrainingByIdHandler,
    GetTrainingByFieldHandler,
    GetAllTrainingHandler,
    TrainingCrudSaga,
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
    TrainingQueryService,
    TrainingCommandService,
  
    //Repositories
    TrainingCommandRepository,
    TrainingQueryRepository,
    TrainingRepository,      
    //Resolvers
    TrainingResolver,
    //Guards
    TrainingAuthGuard,
    //Interceptors
    TrainingInterceptor,
    TrainingLoggingInterceptor,
  ],
})
export class TrainingModule {}

