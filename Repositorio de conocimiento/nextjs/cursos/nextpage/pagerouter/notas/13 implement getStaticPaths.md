# implement getStaticPaths

First, let’s set up the files:

* Create a file called [id].js inside the pages/posts directory.
* Also, remove first-post.js inside the pages/posts directory — we’ll no longer use this.

Then, open pages/posts/[id].js in your editor and paste the following code. We’ll fill in ... later:

```tsx
import Layout from '../../components/layout';
 
export default function Post() {
  return <Layout>...</Layout>;
}
```

Then, open lib/posts.js and add the following getAllPostIds function at the bottom. It will return the list of file names (excluding .md) in the posts directory:

```tsx
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
 
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}
```

Important: The returned list is not just an array of strings — it must be an array of objects that look like the comment above. Each object must have the params key and contain an object with the id key (because we’re using [id] in the file name). Otherwise, getStaticPaths will fail.

Finally, we'll import the getAllPostIds function and use it inside getStaticPaths. Open pages/posts/[id].js and copy the following code above the exported Post component:

```tsx
import { getAllPostIds } from '../../lib/posts';
 
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
```

* paths contains the array of known paths returned by getAllPostIds(), which include the params defined by `pages/posts/[id].js`. Learn more in the paths key documentation
* Ignore fallback: false for now — we’ll explain that later.
