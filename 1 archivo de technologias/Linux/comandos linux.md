# Comandos de linux

## ls

List all files, but sorted by size and print the size.

flags:

* s size
* S Sort, sort by file size, largest first
* h human, --human-readable with -l and -s, print sizes like 1K 234M 2G etc.

``` bash
ls -sS
ls -lh #muestra el tamaño de la lista
```

## cd

Move into the previous directory

``` bash
cd -
```

## pwd

Print the current working directory

``` bash
pwd
```

## echo

Print a value to the stardard output

``` bash
echo "Hi Mom!"
```

## mkdir

Make a deeply nested directory and all it’s parent directories

``` bash
mkdir -p new_directory/subdirectory
```

## touch

Create a new file

``` bash
touch diary.txt
touch {1..10}.md # create 10 files
```

## rm

flags:

* r recursive
* f force

``` bash
rm diary.txt
rm -rf directory_to_remove # use carefully
```

## cat

Read a file

``` bash
cat diary.txt
```

## cp

Copy a file or directory recursively

``` bash
cp -r source_dir destination_dir
```

## mv

Move or rename a file

``` bash
mv diary.txt useless-ramblings.txt
```

## which

Use the which command to find the path to a binary.

``` bash
which ls
```

## realpath

get the full path of the file

``` bash
realpath hello.sh 

```
