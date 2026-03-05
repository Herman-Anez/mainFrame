# API Routes

API Routes let you create an API endpoint inside a Next.js app. You can do so by creating a function inside the pages/api directory that has the following format:

```tsx
// req = HTTP incoming message, res = HTTP server response
export default function handler(req, res) {
  res.status(200).json({ text: 'Hello' });
}
```

They can be deployed as Serverless Functions (also known as Lambdas).

Try accessing it at http://localhost:3000/api/hello
. You should see {"text":"Hello"}. Note that:

* req is an instance of http.IncomingMessage, plus some pre-built middlewares.
* res is an instance of http.ServerResponse, plus some helper functions.
