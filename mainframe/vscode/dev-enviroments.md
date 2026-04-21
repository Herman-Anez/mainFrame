{
  "postCreateCommand": {
    "server": "npm start",
    "db": ["mysql", "-u", "root", "-p", "my database"]
  }
}
{
  "postCreateCommand": {
    "install-deps": "npm install",
    "migrate-db": "npx prisma migrate dev",
    "start-server": "npm start",
    "db-console": "mysql -u root -proot_password my_app_db"
  }
}