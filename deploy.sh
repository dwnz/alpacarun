#!/bin/sh
mkdir _deploy

cp -r css _deploy/
cp -r img _deploy/
cp -r js _deploy/
cp -r sound _deploy/
cp -r bower_components _deploy/
cp *.html _deploy/
cp *.txt _deploy/

scp -r _deploy/ shnapper@shnappy.com:/var/apps/alpacarun.danielwylie.me/

rm -r _deploy