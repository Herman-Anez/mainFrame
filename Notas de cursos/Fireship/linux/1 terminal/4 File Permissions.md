 # File Permissions

 USER GROUP OTHER
  RWX  RWX  RWX

Show File Permissions

Use the -l flag to show file permissions:

```
ls -l
```

Change File Permissions

Add write access to a group

```
chmod g+w somefile.txt
```

Remove write access to a group:

```
chmod g-w somefile.txt
```

Add a specific file permission config, like readonly:

```
chmod g=r somefile.txt
```

Update file permissions with octal notation:

```
chmod 644 somefile.txt
```


