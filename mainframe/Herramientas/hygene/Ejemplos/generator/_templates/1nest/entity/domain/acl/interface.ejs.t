---
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/services/i-external-module.service.ts
---
export interface IExternalModuleService {
  /**
   * TODO: Define los métodos que tu dominio necesita.
   * Ejemplo: verify(data: any): Promise<boolean>;
   */
  check(id: string): Promise<boolean>;
}