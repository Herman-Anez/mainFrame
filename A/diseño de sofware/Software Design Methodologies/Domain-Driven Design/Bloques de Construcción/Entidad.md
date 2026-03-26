# Entidad

Algo que tiene identidad única y cambia con el tiempo. Un cliente (mismo cliente → puede cambiar email, dirección…).

En codigo tiende a ser una instancia de un elemento de la base de datos

```tsx
export class cliente {
  constructor(
    public id: string,
    public name: string,
  ) {}

  updateName(name: string) {
    if (!name) throw new Error('Name is required');
    this.name = name;
  }
}
```