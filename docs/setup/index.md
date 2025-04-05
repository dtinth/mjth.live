# Server setup

This page describes how our Jamulus servers are set up. They are running on Debian VPS in Thailand.

## Set up Jamulus

```sh
# Set up Jamulus
curl https://raw.githubusercontent.com/jamulussoftware/jamulus/main/linux/setup_repo.sh > setup_repo.sh
chmod +x setup_repo.sh && sudo ./setup_repo.sh && sudo apt install jamulus-headless -y

# Generate a secret key for JSON RPC
openssl rand -hex 16 | sudo tee /etc/jamulusjsonrpcsecret

# Create a wrapper script for Jamulus
sudo tee /usr/local/bin/jamulus-server > /dev/null <<"EOF"
#!/bin/bash
MAX_USERS=40
SERVER_NAME="MJTH [FIXME]"
SERVER_LOCATION="FIXME, BKK"
SERVER_DIRECTORY=anygenre1.jamulus.io:22124

exec /usr/bin/jamulus-headless -s -n \
  --jsonrpcport 22222 \
  --jsonrpcsecretfile /etc/jamulusjsonrpcsecret \
  -u "$MAX_USERS" \
  --serverinfo "$SERVER_NAME;$SERVER_LOCATION;211" \
  --directoryserver "$SERVER_DIRECTORY" \
  -w "..."
EOF
sudo chmod +x /usr/local/bin/jamulus-server

# Override the ExecStart in systemd service file
sudo mkdir -p /etc/systemd/system/jamulus-headless.service.d
sudo tee /etc/systemd/system/jamulus-headless.service.d/override.conf > /dev/null <<"EOF"
[Service]
ExecStart=
ExecStart=/usr/local/bin/jamulus-server
MemorySwapMax=0
EOF

sudo systemctl enable jamulus-headless
sudo systemctl daemon-reload && sudo systemctl restart jamulus-headless
```

## Check status

```sh
# View status
sudo systemctl status jamulus-headless

# View logs
sudo journalctl -u jamulus-headless
```

## Install Docker

```sh
# Install Docker
curl -fsSL https://get.docker.com -o install-docker.sh
sudo sh install-docker.sh
sudo usermod -aG docker $USER
```

## Install RPC gateway

```sh
mkdir -p mjth
cd mjth
tee docker-compose.yml > /dev/null <<"EOF"
services:
  gateway:
    image: ghcr.io/dtinth/jamulus-json-rpc-api-gateway:main
    network_mode: host
    restart: unless-stopped
    environment:
      - JAMULUS_HOST=127.0.0.1
      - JAMULUS_PORT=22222
      - JAMULUS_SECRET=/etc/jamulusjsonrpcsecret
      - API_KEYS
      - PORT=63127
      - LISTEN_HOST=127.0.0.1
    volumes:
      - /etc/jamulusjsonrpcsecret:/etc/jamulusjsonrpcsecret:ro
EOF
echo "API_KEYS=$(openssl rand -hex 16)" | tee .env
docker compose up -d
```

## Install Jamulus lounge

```sh
git clone https://github.com/dtinth/jamulus-lounge.git
cd jamulus-lounge
docker compose pull && docker compose run --rm server yarn
tee .env > /dev/null <<"EOF"
CLIPPER_UPLOAD_URL=
CLIPPER_UPLOAD_KEY=
CLIPPER_UPLOAD_NAMESPACE=
EOF
docker compose up -d
```

## Install web server

```sh
# Install Caddy
sudo apt install caddy
```

Configure Caddy:

<!--
# https://notes.dt.in.th/CaddyAccessLogging
{
  log {
    output file /var/log/caddy/access.log
    format filter {
      request>headers delete
      resp_headers delete
    }
  }
}
-->

```
# /etc/caddy/Caddyfile
code-name.server.mjth.live {
  handle_path /gateway/* {
    reverse_proxy http://localhost:63127
  }
  reverse_proxy http://localhost:9998
}
```

```sh
sudo systemctl reload caddy
```

## Install recman

```sh
sudo mkdir -p /var/local/jamulus/recordings && sudo chmod a+rwx /var/local/jamulus/recordings
cd mjth
tee docker-compose.override.yml > /dev/null <<"EOF"
services:
  recman:
    image: ghcr.io/dtinth/mjth-recman:main
    network_mode: host
    restart: unless-stopped
    environment:
      - API_GATEWAY_API_KEY=${API_KEYS}
      - UPLOAD_ENDPOINT_URL
      - UPLOAD_ENDPOINT_KEY
    volumes:
      - /var/local/jamulus/recordings:/var/local/jamulus/recordings
EOF
echo "UPLOAD_ENDPOINT_URL=" >> .env
echo "UPLOAD_ENDPOINT_KEY=" >> .env

# Update the upload endpoint URL and key, then run:
docker compose up -d
```
