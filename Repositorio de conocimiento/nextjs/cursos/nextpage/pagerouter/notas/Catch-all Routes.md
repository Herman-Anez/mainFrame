# Catch-all Routes

Dynamic routes can be extended to catch all paths by adding three dots (...) inside the brackets. For example:

    pages/posts/[...id].js matches /posts/a, but also /posts/a/b, /posts/a/b/c and so on.

If you do this, in getStaticPaths, you must return an array as the value of the id key like so:
```tsx
return [
  {
    params: {
      // Statically Generates /posts/a/b/c
      id: ['a', 'b', 'c'],
    },
  },
  //...
];
```
And params.id will be an array in getStaticProps:

```tsx
export async function getStaticProps({ params }) {
  // params.id will be like ['a', 'b', 'c']
}
```