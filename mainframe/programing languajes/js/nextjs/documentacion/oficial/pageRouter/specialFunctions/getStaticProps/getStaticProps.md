

## getStaticProps

Se ejecuta en build time.

```js
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()

  return { props: { posts } }
}
```

Características

* Corre solo cuando haces next build
* Genera HTML estático
* Súper rápido
* Excelente para SEO
* Puede usar revalidate (ISR)

getStaticProps can only be exported from a page. You can’t export it from non-page files.


#### con ISR (Incremental Static Regeneration)

```js 
export async function getStaticProps() {
  return {
    props: { posts },
    revalidate: 60, // se regenera cada 60 segundos
  }
}
```
 Comparación rápida
Característica	getServerSideProps	getStaticProps
Cuándo corre	En cada request	En build
Performance	Más lenta	Muy rápida
Datos frescos	Siempre	Solo en build (o ISR)
SEO	Excelente	Excelente
Escala mejor	❌	✅



