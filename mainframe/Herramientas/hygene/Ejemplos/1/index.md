# Instalar 

npm i -g hygen

Paso 1: Inicializar el entorno

`hygen init self`

¿Qué acaba de pasar? Se creó una carpeta _templates en tu proyecto. Esta carpeta es el "cerebro" donde Hygen buscará tus planos de construcción.

Paso 2: Crear la estructura del generador

Vamos a crear una categoría llamada ddd y una acción llamada entity. Ejecuta:
Bash

`hygen generator new --name ddd --action entity`

Resultado: Ahora tienes esta ruta: _templates/ddd/entity/. Dentro verás un archivo llamado hello.ejs.t. Bórralo, no lo necesitamos.



Configuración del prompt.js

Primero, vamos a hacer que Hygen nos pregunte el nombre. Ve a _templates/ddd/entity/prompt.js:
JavaScript

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "¿Nombre de la entidad? (ej. User)",
    validate: (val) => val.length > 0 || "¡El nombre es obligatorio!"
  }
];


Paso 3: Definir las plantillas de TypeScript

Ahora vamos a crear los archivos que definirán tu estructura DDD. Crea estos tres archivos dentro de _templates/ddd/entity/:

A. La Entidad (Domain)

Crea domain-entity.ejs.t:
Fragmento de código

---
to: src/modules/<%= h.inflection.dasherize(name) %>/domain/<%= h.inflection.pascalCase(name) %>Entity.ts
---
<% Name = h.inflection.pascalCase(name) -%>
export interface <%= Name %>Props {
  id: string;
  createdAt: Date;
}

export class <%= Name %>Entity {
  constructor(private readonly props: <%= Name %>Props) {}

  static create(props: <%= Name %>Props): <%= Name %>Entity {
    return new <%= Name %>Entity(props);
  }
}

B. El Repositorio (Domain Interface)

Crea repository-interface.ejs.t:
Fragmento de código

---
to: src/modules/<%= h.inflection.dasherize(name) %>/domain/I<%= h.inflection.pascalCase(name) %>Repository.ts
---
<% Name = h.inflection.pascalCase(name) -%>
import { <%= Name %>Entity } from './<%= Name %>Entity';

export interface I<%= Name %>Repository {
  save(entity: <%= Name %>Entity): Promise<void>;
  findById(id: string): Promise<<%= Name %>Entity | null>;
}

C. El Caso de Uso (Application)

Crea use-case.ejs.t:
Fragmento de código

---
to: src/modules/<%= h.inflection.dasherize(name) %>/application/Create<%= h.inflection.pascalCase(name) %>.ts
---
<% Name = h.inflection.pascalCase(name) -%>
import { I<%= Name %>Repository } from '../domain/I<%= Name %>Repository';

export class Create<%= Name %>UseCase {
  constructor(private repository: I<%= Name %>Repository) {}

  async execute() {
    // Lógica del caso de uso
  }
}

Paso 4: ¡A generar!

Ahora viene la magia. Cada vez que necesites una entidad nueva (por ejemplo, "User"), solo corre en tu terminal:
Bash

hygen ddd entity --name User

¿Qué verás en tu editor?
Automáticamente se habrá creado esto:
Plaintext

src/
 └── modules/
      └── user/
           ├── domain/
           │    ├── UserEntity.ts
           │    └── IUserRepo.ts
           └── application/
                └── CreateUser.ts

¿Por qué esto es mejor que copiar y pegar?

    Cero errores de nombre: El dasherize pone las carpetas en minúsculas (user-profile) y el pascalCase pone las clases perfectas (UserProfile).

    Velocidad: En 1 segundo tienes 3 archivos listos con sus imports ya conectados.

    Consistencia: Todo tu proyecto seguirá exactamente la misma estructura de DDD.