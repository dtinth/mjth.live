#!/bin/bash -e
export DOCKER_CONTEXT=mjth-peanut-express
export FNOX_PROFILE=peanut-express
export FNOX_AGE_KEY=$(cat ~/.config/fnox/age-mjth.txt | grep "AGE-SECRET-KEY")
export PUBLIC_HOST=103.27.201.197
export JAMULUS_MAX_USERS=20
export SERVER_NAME="MJTH [Phayathai]"
export SERVER_LOCATION="Ruk-Com/CSLox, BKK;TH"
export SERVER_DIRECTORY=anygenre1.jamulus.io:22124
export DOMAIN=peanut-express.server.mjth.live

fnox exec docker compose --project-name=mjth-server --project-directory=setup up --detach --pull always --build