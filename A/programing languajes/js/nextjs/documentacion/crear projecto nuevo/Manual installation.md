# Manual installation
To manually create a new Next.js app, install the required packages:

`pnpm i next@latest react@latest react-dom@latest`
`pnpm add -D @types/react`


Good to know:

* The App Router uses React canary releases
built-in, which include all the stable React 19 changes, as well as newer features being validated in frameworks, but you should still declare react and react-dom in package.json for tooling and ecosystem compatibility.
* The Pages Router uses the React version from your package.json.

Then, add the following scripts to your package.json file:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

These scripts refer to the different stages of developing an application:

* next dev: Starts the development server using Turbopack (default bundler).
* next build: Builds the application for production.
* next start: Starts the production server.
* eslint: Runs ESLint.


Set up linting

ESLint

Get linting working quickly with the ESLint CLI (flat config):

Install ESLint and the Next.js config:

`pnpm add -D eslint@9 eslint-config-next`

Create eslint.config.mjs with the Next.js config:

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
 
const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])i,mport { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
])

 
export default eslintConfig
```