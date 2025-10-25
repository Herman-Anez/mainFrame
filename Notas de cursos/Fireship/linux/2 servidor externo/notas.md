Notas

Capitulo 1

Se eligio un Vps (Vultr) pero aca se hara con un contenedor virtual

Capitulo 2 

Se registro una clave ssh en vultr

De manera paralela nosotros creamos la llave y la pasamos al contenedor con el siguiente comando

ssh kriv@172.17.0.2 -p 2222 "mkdir -p ~/.ssh/authorized_keys" &&
scp -P 2222 ~/.ssh/id_ed25519.pub kriv@172.17.0.2:~/.ssh/authorized_keys

para esto necesitamos nuestro entorno preparado

Capitulo 3

instalamos el projecto con git

Capitulo 4 firewall

Debido a que nuestro contenedor maneja los puertos de manera automatica no podremos aplicar lo de este capitulo

Recomiendo investigar sobre  Uncomplicated Firewall


Port Reference for this Project

The following ports are opened for external use:

    80 HTTP
    443 HTTPS
    22 SSH

These ports are only used internally, i.e by localhost:

    3000 Next.js
    8090 Pocketbase

Setup Nginx

apt update
apt install nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx

Uncomplicated Firewall

ufw status
ufw app list
ufw allow 'Nginx Full'

Capitulo 5 codigo

copiamos el codigo usando git

En nuestro caso ya lo tenemos ya que es un contenedor

Secure Copy

As an alternative, you can copy the raw files from your local machine to the remote machine.

scp -r /path/to/local/code root@123.45.67.89:/apps/guestbook

Capitulo 6 SSL

No tenemos

Capitulo 7 Ngnx

modificamos la configuracion de ngnx, no tenemos sertificado ssl
Modify the Nginx Config

nano /etc/nginx/sites-available/guestbook
ln -s /etc/nginx/sites-available/guestbook /etc/nginx/sites-enabled/

rm /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

Nginx Config

The Nginx config will redirect all HTTP traffic to HTTPS. It also serves as a reverse proxy to route traffic to either the Next.js frontend or Pocketbase Admin dashboard.

Example of full Nginx config:

server {
    listen 80;
    server_name linux.fireship.app;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name linux.fireship.app;

    # SSL configuration using Cloudflare certificates
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # SSL settings (recommended for security)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # PocketBase API and Admin UI
    location /pb/ {
        rewrite ^/pb(/.*)$ $1 break;
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

Capitulo 8 variables de entorno 
Modify the Nginx Config

nano /etc/nginx/sites-available/guestbook
ln -s /etc/nginx/sites-available/guestbook /etc/nginx/sites-enabled/

rm /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

Nginx Config

The Nginx config will redirect all HTTP traffic to HTTPS. It also serves as a reverse proxy to route traffic to either the Next.js frontend or Pocketbase Admin dashboard.

Example of full Nginx config:

server {
    listen 80;
    server_name linux.fireship.app;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name linux.fireship.app;

    # SSL configuration using Cloudflare certificates
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    # SSL settings (recommended for security)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # PocketBase API and Admin UI
    location /pb/ {
        rewrite ^/pb(/.*)$ $1 break;
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

Capitulo 9 Systemd

Sirve para manejar y gestionar  servicios

Como nosotros trabajamos desde un contenedor no es necesario

Automatically start and heal processes with systemd
Pocketbase Service

ls /etc/systemd/system/

nano /etc/systemd/system/pocketbase.service
touch /var/log/pocketbase.log
chmod 644 /var/log/pocketbase.log

[Unit]
Description=PocketBase

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=4096
Restart=always
RestartSec=5s
StandardOutput=append:/var/log/pocketbase.log
StandardError=append:/var/log/pocketbase.log
ExecStart=/root/apps/guestbook/pocketbase serve --http="127.0.0.1:8090"
Environment="NEXT_PUBLIC_POCKETBASE_URL=https://linux.fireship.app/pb"

[Install]
WantedBy=multi-user.target

Next.js Service

nano /etc/systemd/system/nextjs.service

[Unit]
Description=Next.js Application
After=network.target

[Service]
Type=simple
User=root
Group=root
Restart=always
RestartSec=5s
WorkingDirectory=/root/apps/guestbook
ExecStart=/bin/bash -c 'source /root/.nvm/nvm.sh && /root/.nvm/versions/node/v20.15.0/bin/npm start'
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_POCKETBASE_URL=https://linux.fireship.app/pb"

[Install]
WantedBy=multi-user.target

Run the Services

systemctl daemon-reload

systemctl start pocketbase
systemctl enable pocketbase

systemctl start nextjs
systemctl enable nextjs

systemctl status pocketbase
systemctl status nextjs

