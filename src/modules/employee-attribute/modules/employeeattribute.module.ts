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
import { EmployeeAttributeCommandController } from "../controllers/employeeattributecommand.controller";
import { EmployeeAttributeQueryController } from "../controllers/employeeattributequery.controller";
import { EmployeeAttributeCommandService } from "../services/employeeattributecommand.service";
import { EmployeeAttributeQueryService } from "../services/employeeattributequery.service";

import { EmployeeAttributeCommandRepository } from "../repositories/employeeattributecommand.repository";
import { EmployeeAttributeQueryRepository } from "../repositories/employeeattributequery.repository";
import { EmployeeAttributeRepository } from "../repositories/employeeattribute.repository";
import { EmployeeAttributeResolver } from "../graphql/employeeattribute.resolver";
import { EmployeeAttributeAuthGuard } from "../guards/employeeattributeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeAttribute } from "../entities/employee-attribute.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateEmployeeAttributeHandler } from "../commands/handlers/createemployeeattribute.handler";
import { UpdateEmployeeAttributeHandler } from "../commands/handlers/updateemployeeattribute.handler";
import { DeleteEmployeeAttributeHandler } from "../commands/handlers/deleteemployeeattribute.handler";
import { GetEmployeeAttributeByIdHandler } from "../queries/handlers/getemployeeattributebyid.handler";
import { GetEmployeeAttributeByFieldHandler } from "../queries/handlers/getemployeeattributebyfield.handler";
import { GetAllEmployeeAttributeHandler } from "../queries/handlers/getallemployeeattribute.handler";
import { EmployeeAttributeCrudSaga } from "../sagas/employeeattribute-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { EmployeeAttributeInterceptor } from "../interceptors/employeeattribute.interceptor";
import { EmployeeAttributeLoggingInterceptor } from "../interceptors/employeeattribute.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, EmployeeAttribute]), // Incluir BaseEntity para herencia
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
  controllers: [EmployeeAttributeCommandController, EmployeeAttributeQueryController],
  providers: [
    //Services
    EventStoreService,
    EmployeeAttributeQueryService,
    EmployeeAttributeCommandService,
  
    //Repositories
    EmployeeAttributeCommandRepository,
    EmployeeAttributeQueryRepository,
    EmployeeAttributeRepository,      
    //Resolvers
    EmployeeAttributeResolver,
    //Guards
    EmployeeAttributeAuthGuard,
    //Interceptors
    EmployeeAttributeInterceptor,
    EmployeeAttributeLoggingInterceptor,
    //CQRS Handlers
    CreateEmployeeAttributeHandler,
    UpdateEmployeeAttributeHandler,
    DeleteEmployeeAttributeHandler,
    GetEmployeeAttributeByIdHandler,
    GetEmployeeAttributeByFieldHandler,
    GetAllEmployeeAttributeHandler,
    EmployeeAttributeCrudSaga,
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
    EmployeeAttributeQueryService,
    EmployeeAttributeCommandService,
  
    //Repositories
    EmployeeAttributeCommandRepository,
    EmployeeAttributeQueryRepository,
    EmployeeAttributeRepository,      
    //Resolvers
    EmployeeAttributeResolver,
    //Guards
    EmployeeAttributeAuthGuard,
    //Interceptors
    EmployeeAttributeInterceptor,
    EmployeeAttributeLoggingInterceptor,
  ],
})
export class EmployeeAttributeModule {}

