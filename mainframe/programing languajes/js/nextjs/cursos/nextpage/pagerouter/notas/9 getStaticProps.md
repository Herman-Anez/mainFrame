
# Implement getStaticProps

[back](../pagerouter.md)

Pre-rendering in Next.js

Next.js has two forms of pre-rendering: Static Generation and Server-side Rendering. The difference is in when it generates the HTML for a page.

- `Static Generation`is the pre-rendering method that generates the HTML at build time. The pre-rendered HTML is then reused on each request.
- `Server-side Rendering` is the pre-rendering method that generates the HTML on each request.

Importantly, Next.js lets you choose which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

## Using Static Generation (getStaticProps())

Now, we need to add an import for getSortedPostsData and call it inside getStaticProps in `pages/index.js`.

Open `pages/index.js` in your editor and add the following code above the exported Home component:

```tsx
import { getSortedPostsData } from '../lib/posts';
 
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
```

By returning allPostsData inside the props object in getStaticProps, the blog posts will be passed to the Home component as a prop. Now you can access the blog posts like so:

```JS
export default function Home ({ allPostsData }) { ... }
```

To display the blog posts, let's update the Home component to add another `<section>` tag with the data below the section with your self introduction. Don't forget to also change the props from () to ({ allPostsData }):

```tsx
export default function Home({ allPostsData }) {
  return (
    <Layout home>
      {/* Keep the existing code here */}
 
      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
```

## Here is some essential information you should know about getStaticProps.

### Fetch External API or Query Database

In `lib/posts.js`, we’ve implemented getSortedPostsData which fetches data from the file system. But you can fetch the data from other sources, like an external API endpoint, and it’ll work just fine:

```js
export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch('..');
  return res.json();
}
```

`Note: Next.js polyfills fetch() on both the client and server. You don't need to import it.`

You can also query the database directly:

```ts
import someDatabaseSDK from 'someDatabaseSDK'
 
const databaseClient = someDatabaseSDK.createClient(...)
 
export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
```

This is possible because `getStaticProps` only runs on the server-side. It will never run on the client-side. It won’t even be included in the JS bundle for the browser. That means you can write code such as direct database queries without them being sent to browsers.
Development vs. Production

- In development (npm run dev or yarn dev), `getStaticProps` runs on every request.
- In production, `getStaticProps` runs at build time. However, this behavior can be enhanced using the fallback key returned by getStaticPaths

Because it’s meant to be run at build time, you won’t be able to use data that’s only available during request time, such as query parameters or HTTP headers.
Only Allowed in a Page

`getStaticProps` can only be exported from a page. You can’t export it from non-page files.

One of the reasons for this restriction is that React needs to have all the required data before the page is rendered.

### What If I Need to Fetch Data at Request Time?

Since Static Generation happens once at build time, it's not suitable for data that updates frequently or changes on every user request.

In cases like this, where your data is likely to change, you can use Server-side Rendering. Let's learn more about server-side rendering in the next section.