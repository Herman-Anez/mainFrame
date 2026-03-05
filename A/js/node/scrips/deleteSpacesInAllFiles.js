const fs = require('fs');
const path = require('path');

function renameFilesSpacesToDashes(directoryPath) {
    try {
        // Leer todos los archivos en el directorio
        const files = fs.readdirSync(directoryPath);
        
        let renamedCount = 0;
        
        files.forEach(file => {
            // Crear la ruta completa del archivo
            const oldPath = path.join(directoryPath, file);
            
            // Verificar si es un archivo (no directorio)
            if (fs.statSync(oldPath).isFile()) {
                // Reemplazar espacios por guiones en el nombre
                const newName = file.replace(/\s+/g, '-');
                
                // Solo renombrar si el nombre cambió
                if (newName !== file) {
                    const newPath = path.join(directoryPath, newName);
                    
                    // Renombrar el archivo
                    fs.renameSync(oldPath, newPath);
                    console.log(`✅ Renombrado: "${file}" → "${newName}"`);
                    renamedCount++;
                }
            }
        });
        
        console.log(`\n🎉 Proceso completado. ${renamedCount} archivos renombrados.`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Usar el directorio actual si no se proporciona argumento
const targetDirectory = process.argv[2] || '.';

// Ejecutar la función
renameFilesSpacesToDashes(targetDirectory);