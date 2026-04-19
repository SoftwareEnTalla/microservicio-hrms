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
import { EmployeeCommandController } from "../controllers/employeecommand.controller";
import { EmployeeQueryController } from "../controllers/employeequery.controller";
import { EmployeeCommandService } from "../services/employeecommand.service";
import { EmployeeQueryService } from "../services/employeequery.service";

import { EmployeeCommandRepository } from "../repositories/employeecommand.repository";
import { EmployeeQueryRepository } from "../repositories/employeequery.repository";
import { EmployeeRepository } from "../repositories/employee.repository";
import { EmployeeResolver } from "../graphql/employee.resolver";
import { EmployeeAuthGuard } from "../guards/employeeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "../entities/employee.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateEmployeeHandler } from "../commands/handlers/createemployee.handler";
import { UpdateEmployeeHandler } from "../commands/handlers/updateemployee.handler";
import { DeleteEmployeeHandler } from "../commands/handlers/deleteemployee.handler";
import { GetEmployeeByIdHandler } from "../queries/handlers/getemployeebyid.handler";
import { GetEmployeeByFieldHandler } from "../queries/handlers/getemployeebyfield.handler";
import { GetAllEmployeeHandler } from "../queries/handlers/getallemployee.handler";
import { EmployeeCrudSaga } from "../sagas/employee-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { EmployeeInterceptor } from "../interceptors/employee.interceptor";
import { EmployeeLoggingInterceptor } from "../interceptors/employee.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Employee]), // Incluir BaseEntity para herencia
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
  controllers: [EmployeeCommandController, EmployeeQueryController],
  providers: [
    //Services
    EventStoreService,
    EmployeeQueryService,
    EmployeeCommandService,
  
    //Repositories
    EmployeeCommandRepository,
    EmployeeQueryRepository,
    EmployeeRepository,      
    //Resolvers
    EmployeeResolver,
    //Guards
    EmployeeAuthGuard,
    //Interceptors
    EmployeeInterceptor,
    EmployeeLoggingInterceptor,
    //CQRS Handlers
    CreateEmployeeHandler,
    UpdateEmployeeHandler,
    DeleteEmployeeHandler,
    GetEmployeeByIdHandler,
    GetEmployeeByFieldHandler,
    GetAllEmployeeHandler,
    EmployeeCrudSaga,
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
    EmployeeQueryService,
    EmployeeCommandService,
  
    //Repositories
    EmployeeCommandRepository,
    EmployeeQueryRepository,
    EmployeeRepository,      
    //Resolvers
    EmployeeResolver,
    //Guards
    EmployeeAuthGuard,
    //Interceptors
    EmployeeInterceptor,
    EmployeeLoggingInterceptor,
  ],
})
export class EmployeeModule {}

