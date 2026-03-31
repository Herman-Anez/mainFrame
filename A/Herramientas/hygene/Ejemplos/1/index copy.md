 rm -fr ./test-src && hygen 1nest entity --name Cliente --plural Clientes --addVO true --voList "Email, Number"  --addEvents true --addBoilerplate true
 
1. El Mapa de Carpetas (La Meta)

Cada vez que generes una entidad (ej. User), queremos que se cree esto:
Plaintext

src/modules/user/
├── domain/            <-- Reglas de negocio puras (No sabe nada de DB ni APIs)
├── application/       <-- Casos de uso (Orquestan el dominio)
├── infrastructure/    <-- Implementaciones técnicas (Express, TypeORM, Axios)
└── index.ts           <-- El "Barrel" (Punto de entrada)

2. Configuración del prompt.js

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

3. Las Plantillas por Capas

Vamos a crear 4 archivos dentro de _templates/ddd/entity/. Todos usarán h.changeCase.param(name) para la carpeta (ej: user-group) y h.changeCase.pascal(name) para la clase (ej: UserGroup).
Capa 1: Dominio (El Corazón)

Aquí definimos cómo es el objeto y qué contrato debe seguir su repositorio.
Archivo: domain.ejs.t
Fragmento de código

---
to: src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.pascal(name) %>Entity.ts
---
<% Name = h.changeCase.pascal(name) -%>
export interface <%= Name %>Props {
  id: string;
  createdAt: Date;
}

export class <%= Name %>Entity {
  constructor(public readonly props: <%= Name %>Props) {}

  static create(props: <%= Name %>Props): <%= Name %>Entity {
    return new <%= Name %>Entity(props);
  }
}

// Contrato (Interfaz)
export interface I<%= Name %>Repository {
  save(entity: <%= Name %>Entity): Promise<void>;
  findById(id: string): Promise<<%= Name %>Entity | null>;
}

Capa 2: Aplicación (Los Casos de Uso)

Aquí es donde vive la lógica de "Hacer algo".
Archivo: application.ejs.t
Fragmento de código

---
to: src/modules/<%= h.changeCase.param(name) %>/application/Create<%= h.changeCase.pascal(name) %>.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { I<%= Name %>Repository } from '../domain/<%= Name %>Entity';

export class Create<%= Name %>UseCase {
  constructor(private repository: I<%= Name %>Repository) {}

  async execute(input: any): Promise<void> {
    // 1. Lógica de orquestación
    // 2. Guardar en repo
  }
}

Capa 3: Infraestructura (La Realidad)

Aquí implementamos el repositorio real (ej. con TypeORM) y los controladores si los hubiera.
Archivo: infrastructure.ejs.t
Fragmento de código

---
to: src/modules/<%= h.changeCase.param(name) %>/infrastructure/TypeOrm<%= h.changeCase.pascal(name) %>Repository.ts
---
<% 
  Name = h.changeCase.pascal(name)
  Table = h.changeCase.snake(h.inflection.pluralize(name))
-%>
import { I<%= Name %>Repository } from '../domain/<%= Name %>Entity';
import { <%= Name %>Entity } from '../domain/<%= Name %>Entity';

export class TypeOrm<%= Name %>Repository implements I<%= Name %>Repository {
  private tableName = '<%= Table %>';

  async save(entity: <%= Name %>Entity): Promise<void> {
    console.log(`Guardando en tabla ${this.tableName}`);
  }

  async findById(id: string): Promise<<%= Name %>Entity | null> {
    return null;
  }
}

Capa 4: El Punto de Acceso (Index)

Archivo: index.ejs.t
Fragmento de código

---
to: src/modules/<%= h.changeCase.param(name) %>/index.ts
---
export * from './domain/<%= h.changeCase.pascal(name) %>Entity';
export * from './application/Create<%= h.changeCase.pascal(name) %>';

4. ¿Cómo lo ejecutamos?

Una vez tengas esos 4 archivos en tu carpeta de templates, simplemente corre:
Bash

hygen ddd entity

Escribe User y verás cómo se despliega toda la estructura de capas de golpe.