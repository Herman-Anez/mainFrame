
# Render Markdown

To render markdown content, we’ll use the `remark` library. First, let’s install it:

`npm install remark remark-html`

Then, open `lib/posts.js` and add the following imports to the top of the file:

```tsx
import { remark } from 'remark';
import html from 'remark-html';
```

And update the getPostData() function in the same file as follows to use remark:

```tsx
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
 
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
 
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
 
  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
```

Important: We added the async keyword to getPostData because we need to use await for remark. async/await allow you to fetch data asynchronously

That means we need to update getStaticProps in pages/posts/[id].js to use await when calling getPostData:

```tsx
export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id);
 
  return {
    props: {
      postData,
    },
  };
}
```

Finally, update the Post component in pages/posts/[id].js to render contentHtml using dangerouslySetInnerHTML:

```tsx
export default function Post({ postData }) {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}
```
