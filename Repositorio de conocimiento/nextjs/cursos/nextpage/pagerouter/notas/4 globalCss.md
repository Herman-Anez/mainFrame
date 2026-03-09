# global css
- [back](../pagerouter.md)

Se agregan al archivo `pages/_app.js`

```css
html,
body {
  padding: 0;
  margin: 0;
  font-family:
    -apple-system,
  line-height: 1.6;
  font-size: 18px;
}
 
* {
  box-sizing: border-box;
}
 
```

```js
// `pages/_app.jsx`
import '../styles/global.css';
 
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

```
