#!/bin/bash -e
export DOCKER_CONTEXT=mjth-wrap-wealthy
export FNOX_PROFILE=wrap-wealthy
export FNOX_AGE_KEY=$(cat ~/.config/fnox/age-mjth.txt | grep "AGE-SECRET-KEY")
export PUBLIC_HOST=47.81.39.184
export JAMULUS_MAX_USERS=20
export SERVER_NAME="MJTH [Wattana]"
export SERVER_LOCATION="阿里云, BKK;TH"
export SERVER_DIRECTORY=anygenre1.jamulus.io:22124
export DOMAIN=wrap-wealthy.server.mjth.live

fnox exec docker compose --project-name=mjth-server --project-directory=setup up --detach --pull always --build