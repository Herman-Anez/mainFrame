## ¿Qué es React?

React es una biblioteca de JavaScript (no un framework) creada por Facebook para construir interfaces de usuario (UI). Se basa en componentes: piezas reutilizables e independientes que gestionan su propio estado y se combinan para formar pantallas completas.

Características clave:

- Declarativo: describes qué UI quieres para cada estado, y React se encarga de actualizar y renderizar eficientemente.

- Basado en componentes: encapsulan estructura, estilo y comportamiento.

- Unidireccional: los datos fluyen de padres a hijos mediante props.

- Virtual DOM: mejora el rendimiento al minimizar operaciones directas sobre el DOM real.

## Virtual DOM y cómo funciona

El DOM real es lento de manipular directamente. React mantiene una copia ligera en memoria: el Virtual DOM. Cuando cambia el estado de un componente:

- Se crea un nuevo árbol Virtual DOM.

- React compara (diffing) el nuevo con el anterior.

- Calcula el conjunto mínimo de cambios necesarios.

- Aplica solo esos cambios al DOM real (reconciliación).

Esto permite actualizaciones eficientes sin que tú tengas que tocar el DOM manualmente.

## JSX: JavaScript + XML/HTML

JSX es una extensión de sintaxis que te permite escribir HTML dentro de JavaScript. No es obligatorio, pero es la forma estándar de definir la UI en React.
jsx

`const elemento = <h1>Hola, mundo</h1>;`

Bajo el capó, JSX se transforma en llamadas a React.createElement():
jsx

```JSX
const elemento = <h1 className="saludo">Hola</h1>;
// Se compila a:
const elemento = React.createElement('h1', { className: 'saludo' }, 'Hola');
```

### Reglas importantes de JSX

- Cada componente debe devolver un único elemento raíz (puedes usar <Fragment> o <>...</>).

- Las etiquetas deben cerrarse (<img />, <input />).

- Usa className en lugar de class (porque class es palabra reservada en JS).

- Puedes incrustar expresiones JavaScript dentro de {}: {variable}, {2+2}, {cond ? 'A' : 'B'}.

## Componentes: Funcionales vs Clase

### Componentes funcionales (

Son funciones que reciben props y retornan JSX.

```jsx
function Saludo(props) {
  return <h1>Hola, {props.nombre}</h1>;
}
```

### Componentes de clase (antiguos, pero los verás en código legacy)

Extienden React.Component y tienen un método render().

```jsx
class Saludo extends React.Component {
  render() {
    return <h1>Hola, {this.props.nombre}</h1>;
  }
}
```

¿Por qué funcionales? Son más simples, menos código, y con los Hooks (desde React 16.8) pueden hacer todo lo que hacían las clases (estado, ciclo de vida, etc.).


## Props: comunicación padre → hijo

Las props (propiedades) son datos de solo lectura que un padre pasa a un hijo. El hijo no puede modificar sus propias props.
jsx

// Padre
```jsx
function App() {
  return <Saludo nombre="María" edad={25} />;
}
```

// Hijo
```jsx
function Saludo({ nombre, edad }) {  // destructuring
  return <p>{nombre} tiene {edad} años</p>;
}
```

- Las props pueden ser strings, números, booleanos, arrays, objetos, funciones...

- Las props no se deben modificar dentro del componente hijo.

## Estado (state) y useState

El estado es información interna que un componente puede modificar, y cada cambio provoca un re-render. En componentes funcionales usamos el Hook useState.
jsx

import { useState } from 'react';

```jsx
function Contador() {
  const [contador, setContador] = useState(0); // valor inicial 0

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

- useState devuelve un array: [estadoActual, funciónActualizadora].

- La actualización puede ser un valor directo o una función (si depende del estado previo): setContador(prev => prev + 1).

- Cuando el estado cambia, React re-renderiza el componente y sus hijos (salvo optimizaciones).

## Efectos secundarios y useEffect

useEffect permite ejecutar código cuando el componente se monta, actualiza o desmonta. Es el reemplazo de los métodos de ciclo de vida de clases (componentDidMount, componentDidUpdate, componentWillUnmount).
jsx

import { useState, useEffect } from 'react';

function Reloj() {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    // Efecto: se ejecuta después del primer render (montaje)
    const timer = setInterval(() => setFecha(new Date()), 1000);

    // Cleanup: se ejecuta antes de desmontar y antes del próximo efecto
    return () => clearInterval(timer);
  }, []); // Array de dependencias vacío => solo montaje/desmontaje

  return <p>{fecha.toLocaleTimeString()}</p>;
}

Dependencias:

    [] → solo al montar y desmontar.

    [var1, var2] → cada vez que var1 o var2 cambien.

    Sin array → después de cada render.

Usos típicos: llamadas a APIs, suscripciones, timers, manipulación manual del DOM.
8. Renderizado condicional

Puedes usar JavaScript normal (if, operador ternario, && lógico) dentro del JSX.
jsx

function Mensaje({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Bienvenido de nuevo</p>
      ) : (
        <button>Iniciar sesión</button>
      )}
    </div>
  );
}

// También: {isLoggedIn && <PanelAdmin />}

1. Listas y keys

Para renderizar arrays de elementos, usa map(). Cada elemento debe tener una key única (estable, predecible, no el índice a menos que la lista sea estática).
jsx

function ListaTareas({ tareas }) {
  return (
    <ul>
      {tareas.map(tarea => (
        <li key={tarea.id}>{tarea.texto}</li>
      ))}
    </ul>
  );
}

Las key ayudan a React a identificar qué elementos cambiaron, se añadieron o eliminaron, mejorando el rendimiento.
10. Manejo de eventos y formularios

Los eventos en React se nombran con camelCase (onClick, onSubmit) y reciben una función, no un string.
jsx

function Boton() {
  const handleClick = (e) => {
    e.preventDefault(); // importante para formularios
    console.log('clickeado');
  };
  return <button onClick={handleClick}>Click</button>;
}

Formularios controlados vs no controlados

Controlado: el estado de React es la única fuente de verdad. El valor del input está vinculado al estado.
jsx

function Formulario() {
  const [nombre, setNombre] = useState('');

  return (
    <input
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
    />
  );
}

No controlado: usas ref para leer el valor del DOM directamente (menos común, útil para integraciones con código no React). Se usa useRef.
jsx

function Formulario() {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    alert(inputRef.current.value);
  };

  return <input ref={inputRef} />;
}

1. Hooks esenciales (además de useState y useEffect)

    useContext: consume un Context (ver más abajo) sin anidar componentes.

    useReducer: alternativa a useState para lógica de estado compleja (múltiples sub-valores o transiciones dependientes). Es como un mini Redux.

jsx

const initialState = { count: 0 };
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, initialState);

    useRef: guarda un valor mutable que no causa re-render cuando cambia. Muy usado para referencias a elementos del DOM o para guardar valores previos.

    useMemo: memoriza el resultado de una función costosa para que no se recalcule en cada render a menos que sus dependencias cambien.

    useCallback: similar pero memoriza la función en sí, útil para pasarla a hijos optimizados con React.memo.

12. Comunicación entre componentes

    Padre → Hijo: props.

    Hijo → Padre: el padre pasa una función como prop, el hijo la llama con datos.

    Entre hermanos: "levantar el estado" (lifting state up): el estado común se mueve al primer ancestro común, y se pasan datos y callbacks mediante props.

jsx

function Padre() {
  const [valor, setValor] = useState('');
  return (
    <>
      <HijoEntrada onCambio={setValor} />
      <HijoSalida texto={valor} />
    </>
  );
}

    Componentes no relacionados: Context API o librerías externas (Redux, Zustand).

13. Context API (estado global ligero)

Evita el "prop drilling" (pasar props por muchos niveles). Crea un contexto, provee un valor y consúmelo en cualquier descendiente.
jsx

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

Para valores que cambian frecuentemente, combínalo con useState o useReducer.
14. Estilos en React

    CSS tradicional: importa './MiComponente.css' y usa className.

    CSS Modules: archivo MiComponente.module.css, las clases se importan como objeto y son únicas localmente.

    Styled-components (librería): escribe CSS dentro de JS usando tagged templates.

    Inline styles: style={{ color: 'red', backgroundColor: 'black' }} (camelCase).

15. React Router (navegación en SPA)

React no tiene enrutador propio. La librería estándar es react-router-dom.
jsx

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

1. Buenas prácticas y patrones comunes

    Componentes pequeños y con una sola responsabilidad.

    Nombres claros: PascalCase para componentes, camelCase para variables/funciones.

    Evita lógica en el JSX: sácala a funciones auxiliares o hooks personalizados.

    Hooks personalizados: encapsulan lógica con estado/efectos para reutilizar entre componentes.

jsx

function useContador(inicial = 0) {
  const [contador, setContador] = useState(inicial);
  const incrementar = () => setContador(c => c + 1);
  return [contador, incrementar];
}

    React DevTools: extensión de navegador imprescindible para inspeccionar componentes, estado y props.

    Memoización selectiva: usa React.memo para evitar re-render innecesarios de componentes que reciben las mismas props, y useCallback/useMemo para estabilizar referencias.

17. Herramientas para empezar un proyecto

    Vite (recomendado hoy): npm create vite@latest mi-app -- --template react

    Create React App (más legacy): npx create-react-app mi-app

    Next.js (framework fullstack con React): si necesitas SSR, generación estática, rutas basadas en archivos.

18. Ciclo de vida en componentes funcionales (resumen con useEffect)
Clase Funcional (useEffect)
componentDidMount useEffect(..., [])
componentDidUpdate useEffect(..., [deps])
componentWillUnmount return () => {...} dentro de useEffect

Además, useLayoutEffect es similar pero se ejecuta sincrónicamente después de mutar el DOM (útil para medir elementos).
19. ¿Qué más necesitas para tener una base completa?

    Manejo de formularios complejos: librerías como React Hook Form.

    Peticiones HTTP: fetch o librerías como Axios, normalmente dentro de useEffect o con librerías de gestión de estado asíncrono (React Query, SWR).

    Gestión de estado avanzada: Redux Toolkit, Zustand, Jotai (cuando Context no es suficiente).

    Testing: Jest + React Testing Library.

    Renderizado en servidor (SSR): Next.js.

    TypeScript: te da tipado estático y mejora la experiencia de desarrollo.

Con estos conceptos tienes los cimientos para entender y construir aplicaciones React reales. Mi consejo: practica haciendo pequeños proyectos (lista de tareas, contador, tablero de notas, app del clima) y luego métete con un proyecto más grande usando enrutador y Context. No intentes abarcar todo de una vez; domina primero componentes, props, estado y efectos, y el resto vendrá naturalmente.
