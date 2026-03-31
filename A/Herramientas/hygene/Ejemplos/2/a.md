Buena idea! Tener un comando separado para añadir Value Objects (vo) a un módulo que ya existe es la forma más "limpia" de trabajar en DDD, porque una entidad suele crecer con el tiempo.

Aquí tienes cómo configurar este segundo generador para complementar el de entity.
1. Estructura de Carpetas

Crea una nueva carpeta de acción llamada vo dentro de tu generador ddd:
_templates/ddd/vo/

Dentro de ella, crearemos dos archivos: prompt.js y new-vo.ejs.t.
2. El prompt.js para añadir VOs

Este prompt es más sencillo porque solo necesitamos el nombre de la entidad madre y el nombre del nuevo objeto.

Archivo: _templates/ddd/vo/prompt.js
JavaScript

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "¿A qué entidad pertenece? (ej. User)",
    validate: (val) => val.length > 0 || "Es obligatorio saber el módulo destino."
  },
  {
    type: 'input',
    name: 'voName',
    message: "¿Nombre del nuevo Value Object? (ej. Password, Phone, Address)",
    validate: (val) => {
      if (!val) return "El nombre del VO es obligatorio.";
      if (/\s/.test(val)) return "No uses espacios.";
      return true;
    }
  }
];

3. La Plantilla del Value Object

Archivo: _templates/ddd/vo/new-vo.ejs.t
Fragmento de código

---
to: src/modules/<%= h.changeCase.param(name) %>/domain/value-objects/<%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>.ts
---
<% 
  EntityName = h.changeCase.pascal(name)
  VoName = h.changeCase.pascal(voName)
-%>
export class <%= EntityName %><%= VoName %> {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): <%= EntityName %><%= VoName %> {
    // Ejemplo de validación genérica
    if (!value || value.length < 2) {
      throw new Error(`Invalid <%= VoName %>: ${value}`);
    }
    return new <%= EntityName %><%= VoName %>(value);
  }

  public getValue(): string {
    return this.value;
  }
}

4. El toque Maestro: Inyectar el nuevo VO en la Entidad

Para no tener que escribir el import a mano en UserEntity.ts, podemos usar la función inject de Hygen para que lo añada solo.

Archivo: _templates/ddd/vo/inject-to-entity.ejs.t
Fragmento de código

---
inject: true
to: src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.pascal(name) %>Entity.ts
before: "export interface <%= h.changeCase.pascal(name) %>Props"
skip_if: <%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>
---
import { <%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %> } from './value-objects/<%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>';

¿Cómo queda tu flujo de trabajo ahora?

    Creas el módulo: hygen ddd entity → Nombre: User. (Esto crea la estructura básica).

    Añades un Email:
    hygen ddd vo → Entidad: User, VO: Email.

    Añades un Password:
    hygen ddd vo → Entidad: User, VO: Password.

Beneficios de este enfoque:

    Escalabilidad: Puedes añadir 10 Value Objects sin tener que volver a generar la entidad completa.

    Seguridad: El skip_if evita que Hygen duplique los imports si ejecutas el comando dos veces por error.

    Orden: Mantiene todos tus objetos de valor dentro de la subcarpeta domain/value-objects/.