nvm install

/// coneccion ssh
[
ssh kriv@172.17.0.2 -p 2222 "mkdir -p ~/.ssh/authorized_keys" &&
scp -P 2222 ~/.ssh/id_ed25519.pub kriv@172.17.0.2:~/.ssh/authorized_keys


rsync -av -e "ssh -p 2222" --rsync-path="mkdir -p ~/.ssh/authorized_keys && rsync" --chmod=700 /home/herman/.ssh/id_ed25519.pub kriv@172.17.0.2:~/.ssh/authorized_keys

ssh kriv@172.17.0.2 -p 2222 "mkdir -p ~/.ssh && echo '$(cat id_ed25519.pub)' > ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
]


   48  nano /etc/nginx/sites-available/guestbook
   49  ln -s /etc/nginx/sites-available/guestbook /etc/nginx/sites-enabled/
   50  rm /etc/nginx/sites-enabled/default
   51  nginx -t
   52  systemctl reload nginx

systemctl start nginx
cd /workspace/j/guestbook
npm install
npm run build
npm start

sudo service nginx reload  

///////////////
TMUX
# Crear sesión para Next.js
tmux new-session -s nextjs-server

# Dentro de tmux:
npm run dev

# Desconectar:
Ctrl + B, luego D

# Reconectar:
tmux attach-session -t nextjs-server

# Listar sesiones:
tmux list-sessions

# Matar sesión:
tmux kill-session -t nextjs-server
/////////////////


///////////////

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

[Unit]
Description=Ngnx
After=network.target

[Service]
Type=simple
User=root
Group=root
Restart=always
RestartSec=5s
WorkingDirectory=/root/apps/guestbook
ExecStart=/bin/bash -c 'service nginx start'

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











# Crear una nueva sesión screen
screen -S nextjs-server

# Iniciar el servidor Next.js dentro de screen
npm run dev
# o
yarn dev
# o
pnpm dev

# Para salir de screen SIN detener el servidor: Ctrl+A luego D

# Para volver a la sesión screen:
screen -r nextjs-server

# Para listar todas las sesiones screen:
screen -ls

# Para eliminar una sesión screen:
screen -X -S nextjs-server quit

