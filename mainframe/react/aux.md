## 1. ¿Qué es React?

React es una biblioteca de JavaScript (no un framework) creada por Facebook para construir interfaces de usuario (UI). Se basa en **componentes**: piezas reutilizables e independientes que gestionan su propio estado y se combinan para formar pantallas completas.

**Características clave:**

- **Declarativo:** Describes qué UI quieres para cada estado, y React se encarga de actualizar y renderizar eficientemente.
- **Basado en componentes:** Encapsulan estructura, estilo y comportamiento.
- **Unidireccional:** Los datos fluyen de padres a hijos mediante props.
- **Virtual DOM:** Mejora el rendimiento al minimizar operaciones directas sobre el DOM real.

---

## 2. Virtual DOM y cómo funciona

El DOM real es lento de manipular directamente. React mantiene una copia ligera en memoria: el **Virtual DOM**. Cuando cambia el estado de un componente:

1. Se crea un nuevo árbol Virtual DOM.
2. React compara (*diffing*) el nuevo con el anterior.
3. Calcula el conjunto mínimo de cambios necesarios.
4. Aplica solo esos cambios al DOM real (*reconciliación*).

Esto permite actualizaciones eficientes sin que tú tengas que tocar el DOM manualmente.

---

## 3. JSX: JavaScript + XML/HTML

JSX es una extensión de sintaxis que te permite escribir HTML dentro de JavaScript. No es obligatorio, pero es la forma estándar de definir la UI en React.

```jsx
const elemento = <h1>Hola, mundo</h1>;
```

Bajo el capó, JSX se transforma en llamadas a `React.createElement()`:

```jsx
const elemento = <h1 className="saludo">Hola</h1>;

// Se compila a:
const elemento = React.createElement('h1', { className: 'saludo' }, 'Hola');
```

### Reglas importantes de JSX

- Cada componente debe devolver un **único elemento raíz** (puedes usar `<Fragment>` o `<>...</>`).
- Las etiquetas deben **cerrarse** (`<img />`, `<input />`).
- Usa `className` en lugar de `class` (porque `class` es palabra reservada en JS).
- Puedes incrustar expresiones JavaScript dentro de `{}`: `{variable}`, `{2+2}`, `{cond ? 'A' : 'B'}`.

---

## 4. Componentes: Funcionales vs Clase

### Componentes Funcionales
Son funciones que reciben props y retornan JSX. Son la forma recomendada actualmente.

```jsx
function Saludo(props) {
  return <h1>Hola, {props.nombre}</h1>;
}
```

### Componentes de Clase
Extienden `React.Component` y tienen un método `render()`. (Antiguos, pero los verás en código legacy).

```jsx
class Saludo extends React.Component {
  render() {
    return <h1>Hola, {this.props.nombre}</h1>;
  }
}
```

> [!NOTE]
> **¿Por qué funcionales?** Son más simples, requieren menos código y, con los Hooks (desde React 16.8), pueden hacer todo lo que hacían las clases (estado, ciclo de vida, etc.).

---

## 5. Props: Comunicación Padre → Hijo

Las **props** (propiedades) son datos de solo lectura que un padre pasa a un hijo. El hijo no puede modificar sus propias props.

```jsx
// Padre
function App() {
  return <Saludo nombre="María" edad={25} />;
}

// Hijo
function Saludo({ nombre, edad }) {  // Destructuring
  return <p>{nombre} tiene {edad} años</p>;
}
```

- Pueden ser strings, números, booleanos, arrays, objetos, funciones...
- Las props **no se deben modificar** dentro del componente hijo.

---

## 6. Estado (State) y `useState`

El estado es información interna que un componente puede modificar, y cada cambio provoca un re-render. En componentes funcionales usamos el Hook `useState`.

```jsx
import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(0); // Valor inicial 0

  return (
    <div>
      <p>Haz hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

- `useState` devuelve un array: `[estadoActual, funciónActualizadora]`.
- La actualización puede ser un valor directo o una función: `setContador(prev => prev + 1)`.
- Cuando el estado cambia, React re-renderiza el componente y sus hijos.

---

## 7. Efectos Secundarios y `useEffect`

`useEffect` permite ejecutar código cuando el componente se monta, actualiza o desmonta.

```jsx
import { useState, useEffect } from 'react';

function Reloj() {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    // Montaje: se ejecuta después del primer render
    const timer = setInterval(() => setFecha(new Date()), 1000);

    // Cleanup: se ejecuta al desmontar el componente
    return () => clearInterval(timer);
  }, []); // Array de dependencias vacío => solo montaje/desmontaje

  return <p>{fecha.toLocaleTimeString()}</p>;
}
```

**Dependencias:**
- `[]` → Solo al montar y desmontar.
- `[var1, var2]` → Cada vez que `var1` o `var2` cambien.
- Sin array → Después de **cada** render.

---

## 8. Renderizado Condicional

Puedes usar JavaScript normal (`if`, operador ternario, `&&` lógico) dentro del JSX.

```jsx
function Mensaje({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Bienvenido de nuevo</p>
      ) : (
        <button>Iniciar sesión</button>
      )}
      {/* Short-circuit operator */}
      {isLoggedIn && <PanelAdmin />}
    </div>
  );
}
```

---

## 9. Listas y Keys

Para renderizar arrays de elementos, usa `map()`. Cada elemento debe tener una `key` única.

```jsx
function ListaTareas({ tareas }) {
  return (
    <ul>
      {tareas.map(tarea => (
        <li key={tarea.id}>{tarea.texto}</li>
      ))}
    </ul>
  );
}
```

Las `key` ayudan a React a identificar qué elementos cambiaron, mejorando el rendimiento.

---

## 10. Manejo de Eventos y Formularios

Los eventos en React se nombran con camelCase (`onClick`, `onSubmit`) y reciben una función.

```jsx
function Boton() {
  const handleClick = (e) => {
    e.preventDefault(); 
    console.log('Clickeado');
  };
  return <button onClick={handleClick}>Click</button>;
}
```

### Formularios Controlados
El estado de React es la única fuente de verdad.

```jsx
function Formulario() {
  const [nombre, setNombre] = useState('');

  return (
    <input
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
    />
  );
}
```

---

## 11. Hooks Esenciales (además de `useState` y `useEffect`)

- **`useContext`:** Consume un Context sin anidar componentes.
- **`useReducer`:** Alternativa a `useState` para lógica de estado compleja.
- **`useRef`:** Guarda un valor mutable que no causa re-render. Muy usado para acceder al DOM.
- **`useMemo`:** Memoriza el resultado de una función costosa.
- **`useCallback`:** Memoriza una función para evitar recreaciones innecesarias.

```jsx
// Ejemplo useReducer
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## 12. Comunicación entre Componentes

- **Padre → Hijo:** Mediante `props`.
- **Hijo → Padre:** El padre pasa una función como prop, el hijo la llama con datos.
- **Entre hermanos:** "Levantar el estado" (*lifting state up*) al ancestro común.
- **Componentes no relacionados:** Context API o librerías alternativas (Redux, Zustand).

---

## 13. Context API (Estado Global Ligero)

Evita el *prop drilling*. Crea un contexto, provee un valor y consúmelo en cualquier descendiente.

```jsx
const TemaContext = React.createContext('claro');

function App() {
  return (
    <TemaContext.Provider value="oscuro">
      <Toolbar />
    </TemaContext.Provider>
  );
}

function Toolbar() {
  const tema = useContext(TemaContext);
  return <div>Tema actual: {tema}</div>;
}
```

---

## 14. Estilos en React

Existen varias formas de aplicar estilos:

1.  **CSS Tradicional:** Importa un archivo `.css` y usa `className`.
    ```jsx
    import './MiComponente.css';
    function Componente() {
      return <div className="contenedor">Hola</div>;
    }
    ```

2.  **CSS Modules:** Archivos `.module.css`. Las clases son únicas localmente.
    ```jsx
    import styles from './MiComponente.module.css';
    <div className={styles.contenedor}>...</div>
    ```

3.  **Styled Components:** CSS-in-JS.
    ```jsx
    const Button = styled.button`
      background: blue;
      color: white;
    `;
    ```

4.  **Inline Styles:** Atributo `style` con objeto JS (camelCase).
    ```jsx
    <div style={{ color: 'red', backgroundColor: 'black' }}>Texto</div>
    ```

---

## 15. React Router (Navegación en SPA)

Librería estándar: `react-router-dom`.

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/acerca">Acerca</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acerca" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 16. Buenas Prácticas y Patrones

- Componentes pequeños con una sola responsabilidad.
- **Nombres:** `PascalCase` para componentes, `camelCase` para variables.
- **Hooks Personalizados:** Encapsulan lógica con estado para reutilizar.
- **Memoización:** Usa `React.memo`, `useCallback` y `useMemo` solo cuando sea necesario.

---

## 17. Ciclo de Vida (Resumen con `useEffect`)

| Clase (Lifecycle) | Funcional (`useEffect`) |
| :--- | :--- |
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` | `useEffect(() => { ... }, [deps])` |
| `componentWillUnmount` | `return () => { ... }` (dentro de `useEffect`) |

---

## 18. Herramientas Recomendadas

- **Vite:** El estándar actual para crear proyectos rápidos.
- **Next.js:** Framework para SSR, SEO y rutas automáticas.
- **React Query:** Excelente para manejo de datos asíncronos y caché.
- **TypeScript:** Recomendado para robustez y autocompletado.

---

> [!TIP]
> **Camino de aprendizaje:** Domina primero componentes, props, estado y efectos. El resto vendrá con la práctica. ¡No intentes aprender todo a la vez!
