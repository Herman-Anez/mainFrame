# Puertos

Los Contratos

aca se tienden a definir los casos de uso

Definimos el Puerto de Salida. Es una "interfaz" que dice qué acciones puede hacer nuestra base de datos en este caso, sin importar si es SQL, NoSQL o un array en memoria.

```tsx
// src/ice-cream/domain/ice-cream.repository.ts
import { IceCream } from './ice-cream.model';

export interface IceCreamRepository {
  findAll(): Promise<IceCream[]>;
  create(iceCream: IceCream): Promise<IceCream>;
}
```
