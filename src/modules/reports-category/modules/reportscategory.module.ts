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
import { ReportsCategoryCommandController } from "../controllers/reportscategorycommand.controller";
import { ReportsCategoryQueryController } from "../controllers/reportscategoryquery.controller";
import { ReportsCategoryCommandService } from "../services/reportscategorycommand.service";
import { ReportsCategoryQueryService } from "../services/reportscategoryquery.service";

import { ReportsCategoryCommandRepository } from "../repositories/reportscategorycommand.repository";
import { ReportsCategoryQueryRepository } from "../repositories/reportscategoryquery.repository";
import { ReportsCategoryRepository } from "../repositories/reportscategory.repository";
import { ReportsCategoryResolver } from "../graphql/reportscategory.resolver";
import { ReportsCategoryAuthGuard } from "../guards/reportscategoryauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsCategory } from "../entities/reports-category.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateReportsCategoryHandler } from "../commands/handlers/createreportscategory.handler";
import { UpdateReportsCategoryHandler } from "../commands/handlers/updatereportscategory.handler";
import { DeleteReportsCategoryHandler } from "../commands/handlers/deletereportscategory.handler";
import { GetReportsCategoryByIdHandler } from "../queries/handlers/getreportscategorybyid.handler";
import { GetReportsCategoryByFieldHandler } from "../queries/handlers/getreportscategorybyfield.handler";
import { GetAllReportsCategoryHandler } from "../queries/handlers/getallreportscategory.handler";
import { ReportsCategoryCrudSaga } from "../sagas/reportscategory-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ReportsCategoryInterceptor } from "../interceptors/reportscategory.interceptor";
import { ReportsCategoryLoggingInterceptor } from "../interceptors/reportscategory.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ReportsCategory]), // Incluir BaseEntity para herencia
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
  controllers: [ReportsCategoryCommandController, ReportsCategoryQueryController],
  providers: [
    //Services
    EventStoreService,
    ReportsCategoryQueryService,
    ReportsCategoryCommandService,
  
    //Repositories
    ReportsCategoryCommandRepository,
    ReportsCategoryQueryRepository,
    ReportsCategoryRepository,      
    //Resolvers
    ReportsCategoryResolver,
    //Guards
    ReportsCategoryAuthGuard,
    //Interceptors
    ReportsCategoryInterceptor,
    ReportsCategoryLoggingInterceptor,
    //CQRS Handlers
    CreateReportsCategoryHandler,
    UpdateReportsCategoryHandler,
    DeleteReportsCategoryHandler,
    GetReportsCategoryByIdHandler,
    GetReportsCategoryByFieldHandler,
    GetAllReportsCategoryHandler,
    ReportsCategoryCrudSaga,
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
    ReportsCategoryQueryService,
    ReportsCategoryCommandService,
  
    //Repositories
    ReportsCategoryCommandRepository,
    ReportsCategoryQueryRepository,
    ReportsCategoryRepository,      
    //Resolvers
    ReportsCategoryResolver,
    //Guards
    ReportsCategoryAuthGuard,
    //Interceptors
    ReportsCategoryInterceptor,
    ReportsCategoryLoggingInterceptor,
  ],
})
export class ReportsCategoryModule {}

