#!/bin/bash -e
export DOCKER_CONTEXT=mjth-lkb
export FNOX_PROFILE=party-bucket
export FNOX_AGE_KEY=$(cat ~/.config/fnox/age-mjth.txt | grep "AGE-SECRET-KEY")
export PUBLIC_HOST=103.216.158.49
export JAMULUS_MAX_USERS=20
export SERVER_NAME="MJTH [Ladkrabang]"
export SERVER_LOCATION="RDCW, BKK;TH"
export SERVER_DIRECTORY=anygenre1.jamulus.io:22124
export DOMAIN=party-bucket.server.mjth.live

fnox exec docker compose --project-name=mjth-private --project-directory=setup up --detach