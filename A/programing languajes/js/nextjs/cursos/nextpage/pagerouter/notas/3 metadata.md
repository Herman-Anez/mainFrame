# Metadata
[back](../pagerouter.md)

Se usa Head y Link



 ```jsx
 export default function FirstPost() {
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <h1>First Post</h1>
      <h2>
        <Link href="/">← Back to home</Link>
      </h2>
    </>
  );
}
 ```

Notice that a few additional properties have been defined in the Script component:

- `strategy` controls when the third-party script should load. A value of lazyOnload tells Next.js to load this particular script lazily during browser idle time 
- `onLoad` is used to run any JavaScript code immediately after the script has finished loading. In this example, we log a message to the console that mentions that the script has loaded correctly
