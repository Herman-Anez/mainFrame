# Implement getStaticProps

We need to fetch necessary data to render the post with the given id.

To do so, open lib/posts.js again and add the following getPostData function at the bottom. It will return the post data based on id:

```tsx
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

Then, open `pages/posts/[id].js` and replace this line:

`import { getAllPostIds } from '../../lib/posts';`

with the following code:

```tsx
import { getAllPostIds, getPostData } from '../../lib/posts';
 
export async function getStaticProps({ params }) {
  const postData = getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
```

The post page is now using the getPostData function in getStaticProps to get the post data and return it as props.

Now, let's update the Post component to use postData. In pages/posts/[id].js replace the exported Post component with the following code:

```tsx
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
