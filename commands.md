```
service mysql start && \
/workspaces/Hypertube/server/sql/create_user_table_docker.sh
```
```
cd server && \
npm i && \
npm start
```
```
cd client && \
npm i && \
npm start
```

# On your own machine :
```
docker volume create hyper-db
```