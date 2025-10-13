# Comandos de linux

### ls

List all files, but sorted by size and print the size.

flags:
* s size
* S sort

```
ls -sS
```
### cd

Move into the previous directory

```
cd -
```

### pwd

Print the current working directory

```
pwd
```



### echo

Print a value to the stardard output

```
echo "Hi Mom!"
```



mkdir
### 
Make a deeply nested directory and all it’s parent directories

```
mkdir -p new_directory/subdirectory
```

### touch

Create a new file

```
touch diary.txt
```

### 

rm

flags:
* r recursive
* f force

```
rm diary.txt
```


rm -rf directory_to_remove # use carefully

### cat

Read a file

```
cat diary.txt
```

### cp

Copy a file or directory recursively

```
cp -r source_dir destination_dir
```

### mv

Move or rename a file

```
mv diary.txt useless-ramblings.txt
```

### which

Use the which command to find the path to a binary.
command line

```
which ls
```


