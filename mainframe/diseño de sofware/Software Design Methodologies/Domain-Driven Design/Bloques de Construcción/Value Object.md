# Value Object

Algo sin identidad, solo importa qué contiene

```tsx
//Value Object
class datosCliente {
  constructor(
    public name: string,
  ) {}
},
//entity
export class cliente {
  private socios: Socios[] = [];
  
  constructor(
    public id: string,
    public name: string,
  ) {}

  updateName(name: string) {
    if (!name) throw new Error('Name is required');
    this.name = name;
  }
},
```

en este caso la entidad siver como holder para los datos de un cliente, en este caso se podria usar para crear un cliente nuevo.
