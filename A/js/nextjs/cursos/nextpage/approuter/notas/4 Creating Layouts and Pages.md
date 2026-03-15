# Creating Layouts and Pages

[back](../approuter.md)

## Nested routing

Next.js uses file-system routing where folders are used to create nested routes. Each folder represents a route segment that maps to a URL segment.

You can create separate UIs for each route using layout.tsx and `page.tsx` files.

`page.tsx` is a special Next.js file that exports a React component, and it's required for the route to be accessible. In your application, you already have a page file: `/app/page.tsx` - this is the home page associated with the route `/`.

```bash
pages/
├── page.js # "/"
└── ejemplo/
    └── page.js # "/ejemplo"
```



## Root layout

```tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
```

This is called a root layout and is required in every Next.js application. Any UI you add to the root layout will be shared across all pages in your application. You can use the root layout to modify your `<html>` and `<body>` tags, and add metadata.

## Creating a sub  layout

 In Next.js, you can use a special `layout.tsx` file to create UI that is shared between multiple pages. Let's create a layout for the example pages!

Inside the `/example` folder, add a new file called `layout.tsx` and paste the following code:

```tsx
// /app/example/layout.tsx
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

A few things are going on in this code, so let's break it down:

First, you're importing the `<SideNav />` component into your layout. Any components you import into this file will be part of the layout.

The `<Layout />` component receives a children prop. This child can either be a page or another layout. In your case, the pages inside /dashboard will automatically be nested inside a `<Layout />` like so:

One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. This is called partial rendering which preserves client-side React state in the layout when transitioning between pages.

```bash
pages/
├── page.js # "/" Dont afects   
├── layout.js       
└── ejemplo/ 
    ├── page.js # afects              
    ├── layout.js # this layout
    └── secondFolder/
        └── page.js # afects  
            └── thirdFolder/
                └── page.js # afects  
```