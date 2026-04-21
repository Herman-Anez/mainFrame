getServerSideProps return values



<details>

<summary>The getServerSideProps function should return an object with any one of the following properties:</summary>


## props

The props object is a key-value pair, where each value is received by the page component. It should be a serializable object
so that any props passed, could be serialized with JSON.stringify

```js
export async function getServerSideProps(context) {
  return {
    props: { message: `Next.js is awesome` }, // will be passed to the page component as props
  }
}
```

## notFound

The notFound boolean allows the page to return a 404 status and 404 Page. With notFound: true, the page will return a 404 even if there was a successfully generated page before. This is meant to support use cases like user-generated content getting removed by its author.

```js
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()
 
  if (!data) {
    return {
      notFound: true,
    }
  }
 
  return {
    props: { data }, // will be passed to the page component as props
  }
}
```
## redirect

The redirect object allows redirecting to internal and external resources. It should match the shape of { destination: string, permanent: boolean }. In some rare cases, you might need to assign a custom status code for older HTTP clients to properly redirect. In these cases, you can use the statusCode property instead of the permanent property, but not both.

```js
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()
 
  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
 
  return {
    props: {}, // will be passed to the page component as props
  }
}
```
</details>

<br>

[getServerSideProps](./getServerSideProps.md)