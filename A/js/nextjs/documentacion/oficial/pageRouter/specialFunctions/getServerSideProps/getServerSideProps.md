## getServerSideProps

```js
export async function getServerSideProps(context) {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()

  return { props: { posts } }
}
``` 
[parametros](./getServerSideProps.md)
[return](./getServerSideProps.md)

Se ejecuta en cada request.

Behavior

* getServerSideProps runs on the server.
* getServerSideProps can only be exported from a page.
* getServerSideProps returns JSON.


Características

* Corre en el servidor
* Se ejecuta en cada visita
* Siempre datos frescos
* Más lento que estático
* No se puede cachear fácilment

 Ideal para

* Dashboards
* Datos que cambian constantemente
* Información personalizada por usuario
* Autenticación
