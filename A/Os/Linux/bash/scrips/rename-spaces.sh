#!/bin/bash

# Función para renombrar archivos
rename_files() {
    local directory="${1:-.}"  # Usar directorio actual si no se especifica
    
    # Verificar que el directorio existe
    if [ ! -d "$directory" ]; then
        echo "❌ Error: El directorio '$directory' no existe"
        return 1
    fi
    
    local renamed_count=0
    
    # Buscar archivos en el directorio
    for file in "$directory"/*; do
        # Verificar que es un archivo (no directorio)
        if [ -f "$file" ]; then
            # Obtener solo el nombre del archivo (sin ruta)
            filename=$(basename "$file")
            
            # Reemplazar espacios por guiones
            new_name=$(echo "$filename" | tr ' ' '-')
            
            # Solo renombrar si el nombre cambió
            if [ "$new_name" != "$filename" ]; then
                # Construir nueva ruta completa
                new_path="$directory/$new_name"
                
                # Renombrar el archivo
                mv "$file" "$new_path"
                echo "✅ Renombrado: '$filename' → '$new_name'"
                ((renamed_count++))
            fi
        fi
    done
    
    echo "🎉 Proceso completado. $renamed_count archivos renombrados."
}

# Usar directorio actual o el proporcionado como argumento
target_directory="${1:-.}"

# Ejecutar la función
rename_files "$target_directory"