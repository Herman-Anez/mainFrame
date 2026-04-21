 docker run --rm -ti -v $(pwd):/workdir -p 4004:4004 thomvaill/log4brains help


Claro que sí, aquí tienes la conversión de tu comando docker run a un archivo docker-compose.yml y las instrucciones sobre cómo usarlo.
Archivo docker-compose.yml

Guarda el siguiente contenido en un archivo llamado docker-compose.yml en el mismo directorio donde quieres ejecutar el comando:
YAML

version: '3.8'

services:
  log4brains:
    image: thomvaill/log4brains
    volumes:
      - .:/workdir
    ports:
      - "4004:4004"
    tty: true
    stdin_open: true
    command: help

Cómo Usarlo

Una vez que tengas el archivo docker-compose.yml, puedes ejecutar el equivalente a tu comando original usando:
Bash

docker-compose up log4brains

Explicación de los cambios:

    version: '3.8': Especifica la versión de la sintaxis de Docker Compose. Es una buena práctica usar una versión reciente.

    services:: Define los contenedores que componen tu aplicación.

    log4brains:: Es el nombre que le damos al servicio (puedes cambiarlo si quieres).

    image: thomvaill/log4brains: Corresponde a la imagen que especificaste.

    volumes:: Corresponde al flag -v $(pwd):/workdir. El . en .maps maps to the current directory where the docker-compose.yml file is located, which is equivalent to $(pwd).

    ports:: Corresponde al flag -p 4004:4004.

    tty: true y stdin_open: true: Estos dos flags juntos son el equivalente a -ti. Permiten que el contenedor interactúe con tu terminal, lo cual es útil para comandos como help que pueden esperar una entrada o formato de terminal.

    command: help: Especifica el comando por defecto que se ejecutará cuando inicies este servicio con docker-compose up.

Nota Importante sobre --rm:

La opción --rm de docker run elimina el contenedor automáticamente después de que se detiene. Docker Compose no elimina los contenedores automáticamente con up. El contenedor se detendrá después de ejecutar el comando help, pero permanecerá en tu sistema (puedes verlo con docker ps -a). Para limpiar los contenedores detenidos y otros recursos creados por Compose, puedes usar:
Bash

docker-compose down

Para ejecutar otros comandos de log4brains:

Si en el futuro quieres ejecutar otros comandos de log4brains (como init o preview), una forma muy cómoda sin tener que editar el archivo YAML cada vez es usar docker-compose run. Por ejemplo:

    Para inicializar: docker-compose run log4brains init

    Para ver la ayuda: docker-compose run log4brains help (equivalente a tu comando original)

    Para previsualizar: docker-compose run log4brains preview

Cuando usas docker-compose run, Compose crea un nuevo contenedor, ejecuta el comando y luego el contenedor se detiene. Es el método recomendado para comandos "one-off" como help o init. Además, docker-compose run soporta el flag --rm para eliminar el contenedor después de la ejecución: docker-compose run --rm log4brains help.