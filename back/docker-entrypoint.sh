#!/bin/sh

echo "Container starting..."

mkdir -p /uploads/files

if [ -z "$(ls -A /uploads/files 2>/dev/null)" ]; then
  echo "Copying seed books..."
  cp -r /seed/files/* /uploads/files/
fi

exec java -jar /app/app.jar