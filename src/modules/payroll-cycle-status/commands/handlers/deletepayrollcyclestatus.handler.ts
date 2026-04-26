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


import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeletePayrollCycleStatusCommand } from "../deletepayrollcyclestatus.command";
import { PayrollCycleStatusCommandService } from "../../services/payrollcyclestatuscommand.service";

@CommandHandler(DeletePayrollCycleStatusCommand)
export class DeletePayrollCycleStatusHandler
  implements ICommandHandler<DeletePayrollCycleStatusCommand>
{
  constructor(
    private readonly commandService: PayrollCycleStatusCommandService
  ) {}
  async execute(command: DeletePayrollCycleStatusCommand) {
    const id = String(command.payload?.id ?? command.id ?? '');
    return await this.commandService.delete(id);
  }
}
