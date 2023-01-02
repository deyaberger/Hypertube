#!/bin/bash 
set -e
EXIT_CODE=0
mysql -e 'DROP DATABASE hyperdb;' -uroot -ppassword || EXIT_CODE=$?

mysql -e 'CREATE DATABASE hyperdb;' -uroot -ppassword || EXIT_CODE=$?

mysql -uroot -ppassword hyperdb < /workspaces/Hypertube/server/sql/define_db.sql || EXIT_CODE=$?

mysql -e "CREATE USER 'hyperdude'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';" -uroot -ppassword || EXIT_CODE=$?
mysql -e "GRANT ALL PRIVILEGES on *.* TO 'hyperdude'@'localhost' WITH GRANT OPTION;"  -uroot -ppassword || EXIT_CODE=$?
