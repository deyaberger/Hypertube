Kill HOST MYSQL


```bash
cd /etc/mysql/mysql.conf.d

vim mysql.cnf
# Set this
# [mysql]
# port=6606

vim mysqld.cnf
# change the port value as shown here
# pid-file      = /var/run/mysqld/mysqld.pid
# socket        = /var/run/mysqld/mysqld.sock
port            = 6606
# datadir       = /var/lib/mysql
```

```
service mysql start && \
/workspaces/Hypertube/server/sql/create_user_table_docker.sh
```
```
cd server && \
mkdir -p src/yts_response/ \
touch src/yts_response/log.txt \
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