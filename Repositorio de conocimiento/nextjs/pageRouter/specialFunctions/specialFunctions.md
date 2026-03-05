
# Funciones especiales 


- [getServerSideProps](./getServerSideProps/getServerSideProps.md)
- [getStaticProps](#getStaticProps)
- [getStaticPaths](#getStaticPaths)




`getStaticPaths`, `getServerSideProps` y `getStaticProps` solo existen en el Pages Router, no en el App Router moderno de Next.js.



🧠 Regla mental simple

Si tu ruta es dinámica:`/pages/product/[slug].tsx`

Necesitas:

`getStaticPaths()` → qué slugs existen, define qué rutas existen

`getStaticProps()` → qué datos tiene cada slug, define qué contenido tiene 




## getStaticPaths.

Se usa cuando tienes rutas dinámicas generadas estáticamente. /pages/posts/[id].tsx

```js
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`)
  const post = await res.json()

  return {
    props: { post },
  }
}
```
Qué está pasando?

En build time:

getStaticPaths() se ejecuta

Devuelve una lista de rutas a generar

Ejemplo:
paths: [
  { params: { id: "1" } },
  { params: { id: "2" } },
  { params: { id: "3" } },
]

/posts/1
/posts/2
/posts/3

Luego para cada ruta:

Se ejecuta getStaticProps() para generar el contenido.

### El parámetro fallback

Este es el punto clave.

#### 🔴 fallback: false

Solo existen las rutas generadas.

Si visitas otra → 404.

👉 Todo generado en build.

#### 🟡 fallback: true

Si visitas una ruta no generada:

Se genera en el momento.

Se muestra un loading.

Luego se cachea.

#### 🟢 fallback: "blocking"

No muestra loading.

El usuario espera.

Se genera en el servidor.

Se guarda y queda estática después.


