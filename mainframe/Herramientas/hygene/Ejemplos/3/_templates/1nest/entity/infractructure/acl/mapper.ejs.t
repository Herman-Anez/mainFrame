---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/acl/external-module.mapper.ts
---
export class ExternalModuleMapper {
  static toExternal(domainData: any): any {
    // Convierte de tu dominio al formato del otro modulo
    return domainData;
  }

  static toDomain(externalData: any): any {
    // Convierte lo que responde el otro modulo a tu lenguaje
    return externalData;
  }
}