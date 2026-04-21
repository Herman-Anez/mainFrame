# Agregados

Una combinacion de entidaddes y VO dentro de otro elemento que sirve como orquestador 

```tsx
//Value Object
class Hijos {
  constructor(
    public edad: string,
    public nombre: string,
    public sexo: string,
  ) {}
},
//entity
export class Cliente {
  private Hijos: Hijos[] = [];
  
  constructor(
    public id: string,
    public name: string,
  ) {},
  
  // EL AGREGADO PROTEGE LAS REGLAS DE TODO EL GRUPO
  agregarJHijo(nuevoHijo: Hijos) {
    if (this.Hijos.length >= 3) {
      throw new Error('Solo puedes registrar 3 hijos');
    }

  updateName(name: string) {
    if (!name) throw new Error('Name is required');
    this.name = name;
  }
},
```