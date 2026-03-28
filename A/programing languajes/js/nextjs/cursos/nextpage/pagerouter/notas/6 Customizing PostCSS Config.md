# Customizing PostCSS Config
- [back](../pagerouter.md)



Out of the box, with no configuration, Next.js compiles CSS using PostCSS
.

To customize PostCSS config, you can create a top-level file called postcss.config.js. This is useful if you're using libraries like Tailwind CSS
.

Here are the steps to add Tailwind CSS
. First, install the packages:

`npm install -D tailwindcss autoprefixer postcss`

Then, create a postcss.config.js:

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

We also recommend configuring content sources
by specifying the content option on tailwind.config.js:

```js
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // For the best performance and to avoid false positives,
    // be as specific as possible with your content configuration.
  ],
};
```

  To learn more about custom PostCSS configuration, check out the documentation for PostCSS.

  To easily get started with Tailwind CSS, check out our example
  .

