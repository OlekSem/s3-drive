#!/bin/bash
set -e  # зупиняє скрипт при помилці
 
cd react-book-reader
docker build -t library-react --platform linux/amd64,linux/arm64 --build-arg VITE_API_BASE_URL=https://e-library-back.numexa.online .
docker tag library-react:latest utereskovi/library-react:latest
docker push utereskovi/library-react:latest
echo "Done ---client---!"
 
cd ../SpringBootApi
docker build -t library-java --platform linux/amd64,linux/arm64 .
docker tag library-java:latest utereskovi/library-java:latest
docker push utereskovi/library-java:latest
 
echo "Done ---api---!"
 
read -p "Press any key to exit..."