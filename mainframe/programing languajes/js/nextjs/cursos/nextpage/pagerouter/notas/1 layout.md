# Layout

- [back](../pagerouter.md)

en este tutorial se crea un layout como componente y se reusa en las paginas

Tambien pasamos variables para modificar su comportamiento 

```css
 /* components/layout.module.css*/b
.container {
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
}
```

```jsx 
import styles from './layout.module.css';
export default function Layout({ children, aux }) {
  return (
    <div className={styles.container}>
      <main>{children}</main>
      {!aux && ({/*Logica usando la variable*/})}
    </div>
  );
}
```

```jsx 
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
export default function Home() {
  return (
    <Layout aux>
      <section className={utilStyles.headingMd}>
        <p>{...}</p>
      </section>
    </Layout>
  );
}
```

NOTA

Los archivos css se deben crear con la extencion module.css
