# Rutas dinamicas

- [back](../pagerouter.md)

## Page Path Depends on External Data

con el ejemplo pages/posts/[id].js teme,ps una ruta que depende del id del post a ver

para esto se usa la funcion especial getStaticPaths

```js
//lib/posts.js Extrae los id de cada post
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

/// Extrea kis datos de cada post
export function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
 
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
 
  // Combine the data with the id
  return {
    id,
    ...matterResult.data,
  };
}
```

Important: The returned list is not just an array of strings — it must be an array of objects. Each object must have the params key and contain an object with the id key (because we’re using `[id]` in the file name). Otherwise, getStaticPaths will fail.

```jsx
//pages/posts/[id].js
import { getAllPostIds, getPostData } from '../../lib/posts';
 
export async function getStaticProps({ params }) {
  const postData = getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

//Genera un path por cada id de post
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
    </Layout>
  );
}
```
