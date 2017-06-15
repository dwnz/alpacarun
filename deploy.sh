#!/bin/sh
mkdir _deploy

cp *.html _deploy/
cp -r img _deploy/
cp -r js _deploy/
cp -r sound _deploy/

scp -P 63622 -r . shnapper@shnappy.com:/var/apps/alpacarun.danielwylie.me/
scp -P 51316 -r . shnapper@shnappy.com:/var/apps/alpacarun.danielwylie.me/

rm -r _deploy