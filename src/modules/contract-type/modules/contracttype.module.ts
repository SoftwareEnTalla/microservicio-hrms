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
import { ContractTypeCommandController } from "../controllers/contracttypecommand.controller";
import { ContractTypeQueryController } from "../controllers/contracttypequery.controller";
import { ContractTypeCommandService } from "../services/contracttypecommand.service";
import { ContractTypeQueryService } from "../services/contracttypequery.service";

import { ContractTypeCommandRepository } from "../repositories/contracttypecommand.repository";
import { ContractTypeQueryRepository } from "../repositories/contracttypequery.repository";
import { ContractTypeRepository } from "../repositories/contracttype.repository";
import { ContractTypeResolver } from "../graphql/contracttype.resolver";
import { ContractTypeAuthGuard } from "../guards/contracttypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractType } from "../entities/contract-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateContractTypeHandler } from "../commands/handlers/createcontracttype.handler";
import { UpdateContractTypeHandler } from "../commands/handlers/updatecontracttype.handler";
import { DeleteContractTypeHandler } from "../commands/handlers/deletecontracttype.handler";
import { GetContractTypeByIdHandler } from "../queries/handlers/getcontracttypebyid.handler";
import { GetContractTypeByFieldHandler } from "../queries/handlers/getcontracttypebyfield.handler";
import { GetAllContractTypeHandler } from "../queries/handlers/getallcontracttype.handler";
import { ContractTypeCrudSaga } from "../sagas/contracttype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ContractTypeInterceptor } from "../interceptors/contracttype.interceptor";
import { ContractTypeLoggingInterceptor } from "../interceptors/contracttype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ContractType]), // Incluir BaseEntity para herencia
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
  controllers: [ContractTypeCommandController, ContractTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    ContractTypeQueryService,
    ContractTypeCommandService,
  
    //Repositories
    ContractTypeCommandRepository,
    ContractTypeQueryRepository,
    ContractTypeRepository,      
    //Resolvers
    ContractTypeResolver,
    //Guards
    ContractTypeAuthGuard,
    //Interceptors
    ContractTypeInterceptor,
    ContractTypeLoggingInterceptor,
    //CQRS Handlers
    CreateContractTypeHandler,
    UpdateContractTypeHandler,
    DeleteContractTypeHandler,
    GetContractTypeByIdHandler,
    GetContractTypeByFieldHandler,
    GetAllContractTypeHandler,
    ContractTypeCrudSaga,
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
    ContractTypeQueryService,
    ContractTypeCommandService,
  
    //Repositories
    ContractTypeCommandRepository,
    ContractTypeQueryRepository,
    ContractTypeRepository,      
    //Resolvers
    ContractTypeResolver,
    //Guards
    ContractTypeAuthGuard,
    //Interceptors
    ContractTypeInterceptor,
    ContractTypeLoggingInterceptor,
  ],
})
export class ContractTypeModule {}

