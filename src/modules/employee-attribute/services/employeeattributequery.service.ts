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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { EmployeeAttribute } from "../entities/employee-attribute.entity";
import { BaseEntity } from "../entities/base.entity";
import { EmployeeAttributeQueryRepository } from "../repositories/employeeattributequery.repository";
import { EmployeeAttributeResponse, EmployeeAttributesResponse } from "../types/employeeattribute.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { ModuleRef } from "@nestjs/core";
import { logger } from '@core/logs/logger';



@Injectable()
export class EmployeeAttributeQueryService implements OnModuleInit{
  // Private properties
  readonly #logger = new Logger(EmployeeAttributeQueryService.name);
  private readonly loggerClient = LoggerClient.getInstance();

  constructor(private readonly repository: EmployeeAttributeQueryRepository,
  private moduleRef: ModuleRef
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(EmployeeAttribute.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${EmployeeAttribute.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        logger.info(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<EmployeeAttribute>,
    paginationArgs?: PaginationArgs
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
    try {
      const employeeattributes = await this.repository.findAll(options);
      // Devolver respuesta
      logger.info("sms");
      return {
        ok: true,
        message: "Listado de employeeattributes obtenido con éxito",
        data: employeeattributes,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          employeeattributes.length
        ),
        count: employeeattributes.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findById(id: string): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
    try {
      const employeeattribute = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el employeeattribute no existe
      if (!employeeattribute)
        throw new NotFoundException(
          "EmployeeAttribute no encontrado para el id solicitado"
        );
      // Devolver employeeattribute
      return {
        ok: true,
        message: "EmployeeAttribute obtenido con éxito",
        data: employeeattribute,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }



  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({ [field]: value });

      // Respuesta si el employeeattribute no existe
      if (!entities)
        throw new NotFoundException(
          "EmployeeAttributes no encontrados para la propiedad y valor especificado"
        );
      // Devolver employeeattribute
      return {
        ok: true,
        message: "EmployeeAttributes obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
 

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<EmployeeAttribute>,
    paginationArgs?: PaginationArgs
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el employeeattribute no existe
      if (!entities)
        throw new NotFoundException("Entidades EmployeeAttributes no encontradas.");
      // Devolver employeeattribute
      return {
        ok: true,
        message: "EmployeeAttribute obtenido con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
  


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
  }

 

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount(where);

      // Respuesta si el employeeattribute no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades EmployeeAttributes no encontradas para el criterio especificado."
        );
      // Devolver employeeattribute
      return {
        ok: true,
        message: "EmployeeAttributes obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }




  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
    try {
      const entity = await this.repository.findOne(where);

      // Respuesta si el employeeattribute no existe
      if (!entity)
        throw new NotFoundException("Entidad EmployeeAttribute no encontrada.");
      // Devolver employeeattribute
      return {
        ok: true,
        message: "EmployeeAttribute obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeAttributeQueryService.name)
      .get(EmployeeAttributeQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute> | Error> {
    try {
      const entity = await this.repository.findOne(where);

      // Respuesta si el employeeattribute no existe
      if (!entity)
        return new NotFoundException("Entidad EmployeeAttribute no encontrada.");
      // Devolver employeeattribute
      return {
        ok: true,
        message: "EmployeeAttribute obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
}



