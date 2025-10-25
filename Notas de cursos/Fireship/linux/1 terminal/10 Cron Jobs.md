# Cron Jobs

Run background processes on a schedule with Cron
Edit a Cron Schedule

I highly recommend using tools like  [Crontab Guru](https://crontab.guru/#20_4_*_*_5) for generating cron schedules.
How to Start a Cron Job in Linux

Create a basic bash script to run in the background:

``` bash
nano hello.sh
# echo "hello world!"
realpath hello.sh 
# get the full path of the file
```


Start the cron service and edit the crontab file:

``` bash
sudo service cron start
crontab -e
```

Edit the crontab file with the path to your bash script:

``` crontab
*****/mnt/d/apps/linux-playground/hello.sh
```

Verify that the cron job is running:

``` bash
crontab -l
sudo grep CRON /var/log/syslog
sudo grep CRON /var/log/cron
```
