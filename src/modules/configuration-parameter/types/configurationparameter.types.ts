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


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { ConfigurationParameter } from "../entities/configuration-parameter.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de configurationparameter" })
export class ConfigurationParameterResponse<T extends ConfigurationParameter> extends GQResponseBase {
  @ApiProperty({ type: ConfigurationParameter,nullable:false,description:"Datos de respuesta de ConfigurationParameter" })
  @Field(() => ConfigurationParameter, { description: "Instancia de ConfigurationParameter", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de configurationparameters" })
export class ConfigurationParametersResponse<T extends ConfigurationParameter> extends GQResponseBase {
  @ApiProperty({ type: [ConfigurationParameter],nullable:false,description:"Listado de ConfigurationParameter",default:[] })
  @Field(() => [ConfigurationParameter], { description: "Listado de ConfigurationParameter", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de ConfigurationParameter",default:0 })
  @Field(() => Number, { description: "Cantidad de ConfigurationParameter", nullable: false,defaultValue:0 })
  count: number = 0;
}






