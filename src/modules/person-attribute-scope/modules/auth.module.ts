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
import { PersonAttributeScopeCommandController } from "../controllers/personattributescopecommand.controller";
import { PersonAttributeScopeLoggingInterceptor } from "../interceptors/personattributescope.logging.interceptor";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { PersonAttributeScopeAuthGuard } from "../guards/personattributescopeauthguard.guard";

@Module({
  controllers: [PersonAttributeScopeCommandController],
  providers: [
    PersonAttributeScopeAuthGuard,
    PersonAttributeScopeLoggingInterceptor,
    CommandBus,
    EventBus,
    UnhandledExceptionBus,
  ],
  exports: [PersonAttributeScopeAuthGuard, CommandBus, EventBus, UnhandledExceptionBus],
})
export class AuthPersonAttributeScopeModule {}
