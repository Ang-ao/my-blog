#! /bin/bash
## author: Entropy
## This file for bf acticles

sudo mongodump -h 127.0.0.1 -d Acticles -o /home/pi/blog/.blog_tmp/mongoData/
echo 'bf over.'

sudo chown pi:pi -R /home/pi/blog/.blog_tmp/mongoData/Acticles/
echo 'Run over.'
