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
import { PersonCommandController } from "../controllers/personcommand.controller";
import { PersonQueryController } from "../controllers/personquery.controller";
import { PersonCommandService } from "../services/personcommand.service";
import { PersonQueryService } from "../services/personquery.service";

import { PersonCommandRepository } from "../repositories/personcommand.repository";
import { PersonQueryRepository } from "../repositories/personquery.repository";
import { PersonRepository } from "../repositories/person.repository";
import { PersonResolver } from "../graphql/person.resolver";
import { PersonAuthGuard } from "../guards/personauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "../entities/person.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePersonHandler } from "../commands/handlers/createperson.handler";
import { UpdatePersonHandler } from "../commands/handlers/updateperson.handler";
import { DeletePersonHandler } from "../commands/handlers/deleteperson.handler";
import { GetPersonByIdHandler } from "../queries/handlers/getpersonbyid.handler";
import { GetPersonByFieldHandler } from "../queries/handlers/getpersonbyfield.handler";
import { GetAllPersonHandler } from "../queries/handlers/getallperson.handler";
import { PersonCrudSaga } from "../sagas/person-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PersonInterceptor } from "../interceptors/person.interceptor";
import { PersonLoggingInterceptor } from "../interceptors/person.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Person]), // Incluir BaseEntity para herencia
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
  controllers: [PersonCommandController, PersonQueryController],
  providers: [
    //Services
    EventStoreService,
    PersonQueryService,
    PersonCommandService,
  
    //Repositories
    PersonCommandRepository,
    PersonQueryRepository,
    PersonRepository,      
    //Resolvers
    PersonResolver,
    //Guards
    PersonAuthGuard,
    //Interceptors
    PersonInterceptor,
    PersonLoggingInterceptor,
    //CQRS Handlers
    CreatePersonHandler,
    UpdatePersonHandler,
    DeletePersonHandler,
    GetPersonByIdHandler,
    GetPersonByFieldHandler,
    GetAllPersonHandler,
    PersonCrudSaga,
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
    PersonQueryService,
    PersonCommandService,
  
    //Repositories
    PersonCommandRepository,
    PersonQueryRepository,
    PersonRepository,      
    //Resolvers
    PersonResolver,
    //Guards
    PersonAuthGuard,
    //Interceptors
    PersonInterceptor,
    PersonLoggingInterceptor,
  ],
})
export class PersonModule {}

