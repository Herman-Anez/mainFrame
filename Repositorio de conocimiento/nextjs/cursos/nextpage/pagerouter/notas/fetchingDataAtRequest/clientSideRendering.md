Client-side Rendering

If you do not need to pre-render the data, you can also use the following strategy (called Client-side Rendering):

    Statically generate (pre-render) parts of the page that do not require external data.
    When the page loads, fetch external data from the client using JavaScript and populate the remaining parts.

This approach works well for user dashboard pages, for example. Because a dashboard is a private, user-specific page, SEO is not relevant, and the page doesn’t need to be pre-rendered. The data is frequently updated, which requires request-time data fetching.
SWR

The team behind Next.js has created a React hook for data fetching called SWR
. We highly recommend it if you’re fetching data on the client side. It handles caching, revalidation, focus tracking, refetching on interval, and more. We won’t cover the details here, but here’s an example usage:

import useSWR from 'swr';
 
function Profile() {
  const { data, error } = useSWR('/api/user', fetch);
 
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}

Check out the SWR documentation
to learn more.