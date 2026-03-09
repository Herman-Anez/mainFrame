# pageRouter

In Next.js, a page is a React Component exported from a file in the pages directory.
Pages are associated with a route based on their file name. For example, in development:

* `pages/index.js` is associated with the / route.
* `pages/posts/first-post.js` is associated with the /posts/first-post route.

NOTA

```bash
pages/
├── ejemplo.js
├── index.js
└── ejemplo/
    └── index.js
```

en este ejemplo ejemplo/index.js sobre escribe a ejemplo.js

* [layout](./notas/1%20layout.md)
* [assets](./notas/2%20assets.md)
* [metadata](./notas/3%20metadata.md)
* [globalCss](./notas/4%20globalCss.md)
* [clsx](./notas/5%20clsx.md)
* [Customizing PostCSS Config](./notas/6%20Customizing%20PostCSS%20Config.md)
* [preRendering](./notas/7%20Pre-rendering.md)
* [Static Generation with and without Data](./notas/8%20Static%20Generation%20with%20and%20without%20Data.md)
* [getStaticProps](./notas/9%20getStaticProps.md)
* [fetchingDataAtRequest](./notas/10%20fetchingDataAtRequest.md)
* [fetchingDataAtRequest](./notas/)
* [fetchingDataAtRequest](./notas/)
* [dinamicRoutes](./notas/)
* [Catch-all 20Routes](./notas/)
* [apiRutes](./notas/)
* [apiRutes2](./notas/)
* [previewMode](./notas/)

## Componentes especiales

Se usa el componente `<Head> `

### Link

`<Link>` is a React component that extends the HTML `<a>`element to provide prefetching and client-side navigation between routes. It is the primary way to navigate between routes in Next.js.

```js
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

### Image

next/image is an extension of the HTML `<img>`element, evolved for the modern web.

```js
import Image from 'next/image';
 
const YourComponent = () => (
  <Image
    src="/images/profile.jpg" // Route of the image file
    height={144} // Desired size with correct aspect ratio
    width={144} // Desired size with correct aspect ratio
    alt="Your Name"
  />
);
```

### Image

next/image is an extension of the HTML `<img>`element, evolved for the modern web.

```js
import Head from 'next/head';
<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```

### Scrip

next/image is an extension of the HTML `<img>`element, evolved for the modern web.

```js
import Script from 'next/script';
export default function FirstPost() {
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
    </>
  );
}
```

* strategy controls when the third-party script should load. A value of lazyOnload tells Next.js to load this particular script lazily during browser idle time
* onLoad is used to run any JavaScript code immediately after the script has finished loading. In this example, we log a message to the console that mentions that the script has loaded correctly
