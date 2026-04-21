# Page Path Depends on External Data

## How to Statically Generate Pages with Dynamic Routes

In our case, we want to create dynamic routes for blog posts:

* We want each post to have the path `/posts/<id>`, where `<id>` is the name of the markdown file under the top-level posts directory.
* Since we `have ssg-ssr.md` and `pre-rendering.md`, we’d like the paths to be `/posts/ssg-ssr` and `/posts/pre-rendering`.

Overview of the Steps

First, we’ll create a page called `[id].js` under pages/posts. Pages that begin with [ and end with ] are dynamic routes in Next.js.

In `pages/posts/[id].js`, we’ll write code that will render a post page — just like other pages we’ve created.

```tsx
import Layout from '../../components/layout';
 
export default function Post() {
  return <Layout>...</Layout>;
}
```

Now, here’s what’s new: We’ll export an async function called getStaticPaths from this page. In this function, we need to return a list of possible values for id.

```tsx
import Layout from '../../components/layout';
 
export default function Post() {
  return <Layout>...</Layout>;
}
 
export async function getStaticPaths() {
  // Return a list of possible value for id
}
```

Finally, we need to implement getStaticProps again - this time, to fetch necessary data for the blog post with a given id. getStaticProps is given params, which contains id (because the file name is [id].js).

```tsx
import Layout from '../../components/layout';
 
export default function Post() {
  return <Layout>...</Layout>;
}
 
export async function getStaticPaths() {
  // Return a list of possible value for id
}
 
export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
}
```