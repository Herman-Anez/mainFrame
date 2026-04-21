git mv [-v] [-f] [-n] [-k] <source> <destination>

-f
--force

    Force renaming or moving of a file even if the <destination> exists.
-k

    Skip move or rename actions which would lead to an error condition. An error happens when a source is neither existing nor controlled by Git, or when it would overwrite an existing file unless -f is given.
-n
--dry-run

    Do nothing; only show what would happen
-v
--verbose

    Report the names of files as they are moved.
