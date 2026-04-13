// generate.js
const { execSync } = require('child_process');
const config = require('./entity-config');

// Construimos los argumentos del comando
const args = Object.entries(config)
  .map(([key, value]) => `--${key} "${value}"`)
  .join(' ');

// Usamos el nuevo generador ddd-module con npx
const command = `npx hygen ddd-module entity ${args}`;

console.log(`Ejecutando: ${command}`);

try {
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Estructura DDD generada con éxito');
  
} catch (error) {
  console.error('❌ Error al generar la estructura');
}
