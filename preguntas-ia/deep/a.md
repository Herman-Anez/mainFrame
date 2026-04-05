¿Qué son los wildcards?

Son caracteres especiales que representan patrones para coincidir con nombres de archivos y directorios.
Wildcards principales:
1. * - Asterisco (Cualquier cosa)

bash

# Todos los archivos
echo *

# Archivos que empiezan con "doc"
echo doc*

# Archivos que terminan con ".txt"
echo *.txt

# Archivos que contienen "temp"
echo *temp*

# Archivos con extensión de 3 letras
echo *.???

2. ? - Signo de pregunta (Un solo carácter)

bash

# Archivos con exactamente 4 caracteres
echo ????

# Archivos que empiezan con "f" seguido de 3 caracteres
echo f???

# Archivos como: a1.txt, b1.txt, c1.txt
echo ?1.txt

3. [] - Corchetes (Rangos o conjuntos)

bash

# Archivos que empiezan con a, b o c
echo [abc]*

# Archivos que empiezan con cualquier letra
echo [a-z]*

# Archivos con números
echo *[0-9]*

# Archivos que empiezan con vocal
echo [aeiou]*

# Combinación: letra + número
echo [a-z][0-9]*

4. {} - Llaves (Expansión de lista)

bash

# Múltiples patrones específicos
echo {apple,banana,cherry}.txt

# Rangos numéricos
echo file{1..5}.txt

# Rangos de letras
echo {a..c}{1..3}

Ejemplos prácticos:
Operaciones con archivos:

bash

# Copiar todos los archivos .txt
cp *.txt /backup/

# Eliminar archivos temporales
rm *temp* *bak*

# Mover archivos de imagen
mv *.jpg *.png /images/

# Contar archivos .js
ls *.js | wc -l

Patrones complejos:

bash

# Archivos que empiezan con letra y terminan con número
echo [a-z]*[0-9]

# Archivos con exactamente 5 caracteres y extensión .txt
echo ?????.txt

# Archivos que NO empiezan con número
echo [!0-9]*

Wildcards especiales:
[!] o [^] - Negación

bash

# Archivos que NO empiezan con a, b o c
echo [!abc]*

# Archivos que NO son .txt
echo *[!.txt]

** - Recursivo (
    bash 4+)

bash

# Todos los archivos .js en cualquier subdirectorio
echo **/*.js

# Requiere activar globstar
shopt -s globstar

Comandos útiles para probar wildcards:
Ver qué archivos coinciden:

bash

# Ver qué archivos coinciden con el patrón
echo *.txt

# Listar con detalles
ls -la *.js

# Contar coincidencias
echo *.py | wc -w

Con find (alternativa más potente):

bash

# Equivalente a *.txt pero con find
find . -name "*.txt"

# Archivos modificados en últimos 7 días
find . -name "*.log" -mtime -7

Configuración de wildcards en 
bash:
Opciones glob:

bash

# Ver opciones actuales
shopt | grep glob

# Activar globstar para **
shopt -s globstar

# Desactivar wildcards (raro)
set -f

Caracteres especiales que necesitan escape:

bash

# Si quieres buscar literalmente estos caracteres:
echo \*.txt      # Busca archivo llamado "*.txt"
echo archivo\?   # Busca "archivo?"
echo \[hola\]    # Busca "[hola]"

Ejemplos de la vida real:
Organizar fotos:

```bash

# Mover todas las fotos a directorio de imágenes
mv *.{jpg,jpeg,png,gif} ~/Pictures/
```

Limpiar archivos temporales:

```bash

# Eliminar archivos temporales comunes
rm *~ *.tmp *.temp .*~ 2>/dev/null
```

Backup de documentos:

```bash

# Copiar documentos importantes
cp *.{doc,docx,pdf,txt} /backup/documents/

Tabla resumen:
Wildcard	Significado	Ejemplo
*	Cualquier cadena de caracteres	*.txt
?	Un solo carácter	file?.txt
[]	Cualquier carácter de la lista	[abc]*
[!]	Cualquier carácter NO en la lista	[!0-9]*
{}	Expansión de múltiples patrones	{jpg,png}
**	Recursivo (subdirectorios)	**/*.js
⚠️ Precauciones importantes:

```

```bash

# ❌ PELIGROSO - podría eliminar más de lo esperado
rm *   # Elimina TODO

# ✅ Mejor práctica - verificar primero
echo *  # Ver qué se eliminaría
rm *    # Luego eliminar

# O usar -i para confirmación interactiva
rm -i *.tmp
```