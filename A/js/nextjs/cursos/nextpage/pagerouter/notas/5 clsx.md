# clsx
- [back](../pagerouter.md)

is a simple library that lets you toggle class names easily. You can install it using npm install clsx or yarn add clsx.

Please take a look at its documentation
for more details, but here's the basic usage:

- Suppose that you want to create an Alert component which accepts type, which can be 'success' or 'error'.
- If it's 'success', you want the text color to be green. If it's 'error', you want the text color to be red.

You can first write a CSS module (e.g. alert.module.css) like this:

```CSS
.success {
  color: green;
}
.error {
  color: red;
}
```

And use clsx like this:

```tsx
import styles from './alert.module.css';
import { clsx } from 'clsx';
 
export default function Alert({ children, type }) {
  return (
    <div
      className={clsx({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error',
      })}
    >
      {children}
    </div>
  );
}
```