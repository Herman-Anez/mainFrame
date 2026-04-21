# Repositorio

Es la implementacion agnostica del dominio, normalmente aplicado a una interfaz, aca se representan normalmente los casos de usos a cumplir. Luego se a de implementar

```tsx
export interface ClienteRepository {
  guardar(cliente: Cliente): Promise<void>;
  obtenerTodos(): Promise<Cliente[]>;
  buscarPorId(id: string): Promise<Cliente | null>;
}
```