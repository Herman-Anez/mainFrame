# pageRouter 

In Next.js, a page is a React Component exported from a file in the pages directory.
Pages are associated with a route based on their file name. For example, in development:

* `pages/index.js` is associated with the / route.
* `pages/posts/first-post.js` is associated with the /posts/first-post route.

NOTA
```

pages/
├── ejemplo.js
├── index.js
└── ejemplo/
    └── index.js
```
en este ejemplo ejemplo/index.js sobre escribe a ejemplo.js

---


- [Special Files](./specialFiles.MD)
- [special functions](./specialFunctions.md)













--- 
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





### Catch-all Routes

Dynamic routes can be extended to catch all paths by adding three dots (...) inside the brackets. For example:

`pages/posts/[...id].js` matches `/posts/a`, but also `/posts/a/b`, `/posts/a/b/c` and so on.

If you do this, in getStaticPaths, you must return an array as the value of the id key like so:

