#!/bin/bash
ffmpeg -f v4l2 -i /dev/video0 \
  -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 \
  http://localhost:8081/test123 \
  -c:v libx264 -preset veryfast -b:v 2500k -maxrate 2500k -bufsize 5000k \
  -pix_fmt yuv420p -g 50 \
  -f flv "rtmp://live.twitch.tv/app/live_109135433_c0QCgcxQzMB8TQXyM9i4aWgzcb9BEY"