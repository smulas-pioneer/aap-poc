cp ./express/* ./build

cd ./build

docker stop aap-poc

docker rm aap-poc 

docker run -p 49160:8080 --name aap-poc -d aap-poc
