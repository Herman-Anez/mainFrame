# Using Local JSON Files as a Mini Database in Next.js 

https://javascript.plainenglish.io/using-local-json-files-as-a-mini-database-in-next-js-beginner-friendly-guide-5c10df3a9154

What you will learn in this blog

* How I use a local JSON file as a lightweight database in Next.js
* How to structure a simple data/posts.json
* How to read JSON data using fs
* How to return dynamic blog posts through API routes
* How to add a basic POST + write method for prototyping
* SEO-friendly and simple techniques you can reuse

## Create Your Local JSON “Database”

```json
///data/series.json
[
  {
    "id": 1,
    "title": "Hora de aventura",
    "content": "Hello from a JSON database!",
    "date": "2025-01-10"
  }
]
```

# Reading JSON Data in Next.js Using fs

Next.js allows server-only code in
API routes or Route Handlers.

Here’s my go-to route:
```js
// /app/api/posts/route.js
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "posts.json");
  const fileData = await fs.readFile(filePath, "utf8");
  const posts = JSON.parse(fileData);
  return Response.json(posts);
}
```
What’s happening here?

    fs.readFile loads your JSON
    JSON.parse makes it JavaScript-friendly
    You return the data as API JSON

That means you can hit:
/api/posts
and instantly get all posts.

# Rendering JSON Data Dynamically in a Next.js Page
I usually grab the posts like this:

```js
// /app/page.js

async function getPosts() {
  const res = await fetch("http://localhost:3000/api/posts");
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <main>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </main>
  );
}
```

This pulls live JSON data and renders it — no database required.

## Adding New Posts With a Simple POST Handler

Now things get interesting.You can actually write to the JSON file from an API route `/app/api/posts/route.js` (with POST method)

```js
// /app/api/posts/route.js
import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  const newPost = await req.json();
  const filePath = path.join(process.cwd(), "data", "posts.json");
  const fileData = await fs.readFile(filePath, "utf8");
  const posts = JSON.parse(fileData);
  // Add new post with auto-increment id
  newPost.id = posts.length + 1;
  posts.push(newPost);
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
  return Response.json({ message: "Post created", post: newPost });
}
```

Now you can send JSON data (Axios works great) like:

```js
axios.post("/api/posts", {
  title: "New Blog Post",
  content: "JSON databases are cool!",
  date: "2025-01-20"
});
```

And your JSON file updates automatically!