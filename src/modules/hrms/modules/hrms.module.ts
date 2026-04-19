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
import { HrmsCommandController } from "../controllers/hrmscommand.controller";
import { HrmsQueryController } from "../controllers/hrmsquery.controller";
import { HrmsCommandService } from "../services/hrmscommand.service";
import { HrmsQueryService } from "../services/hrmsquery.service";

import { HrmsCommandRepository } from "../repositories/hrmscommand.repository";
import { HrmsQueryRepository } from "../repositories/hrmsquery.repository";
import { HrmsRepository } from "../repositories/hrms.repository";
import { HrmsResolver } from "../graphql/hrms.resolver";
import { HrmsAuthGuard } from "../guards/hrmsauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Hrms } from "../entities/hrms.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateHrmsHandler } from "../commands/handlers/createhrms.handler";
import { UpdateHrmsHandler } from "../commands/handlers/updatehrms.handler";
import { DeleteHrmsHandler } from "../commands/handlers/deletehrms.handler";
import { GetHrmsByIdHandler } from "../queries/handlers/gethrmsbyid.handler";
import { GetHrmsByFieldHandler } from "../queries/handlers/gethrmsbyfield.handler";
import { GetAllHrmsHandler } from "../queries/handlers/getallhrms.handler";
import { HrmsCrudSaga } from "../sagas/hrms-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { HrmsInterceptor } from "../interceptors/hrms.interceptor";
import { HrmsLoggingInterceptor } from "../interceptors/hrms.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Hrms]), // Incluir BaseEntity para herencia
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
  controllers: [HrmsCommandController, HrmsQueryController],
  providers: [
    //Services
    EventStoreService,
    HrmsQueryService,
    HrmsCommandService,
  
    //Repositories
    HrmsCommandRepository,
    HrmsQueryRepository,
    HrmsRepository,      
    //Resolvers
    HrmsResolver,
    //Guards
    HrmsAuthGuard,
    //Interceptors
    HrmsInterceptor,
    HrmsLoggingInterceptor,
    //CQRS Handlers
    CreateHrmsHandler,
    UpdateHrmsHandler,
    DeleteHrmsHandler,
    GetHrmsByIdHandler,
    GetHrmsByFieldHandler,
    GetAllHrmsHandler,
    HrmsCrudSaga,
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
    HrmsQueryService,
    HrmsCommandService,
  
    //Repositories
    HrmsCommandRepository,
    HrmsQueryRepository,
    HrmsRepository,      
    //Resolvers
    HrmsResolver,
    //Guards
    HrmsAuthGuard,
    //Interceptors
    HrmsInterceptor,
    HrmsLoggingInterceptor,
  ],
})
export class HrmsModule {}

