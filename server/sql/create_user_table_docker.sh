#!/bin/bash 
mysql -e 'DROP DATABASE hyperdb;' -uroot -ppassword 

mysql -e 'CREATE DATABASE hyperdb;' -uroot -ppassword 

mysql -uroot -ppassword hyperdb < /workspaces/Hypertube/server/sql/define_db.sql 

mysql -e "CREATE USER 'hyperdude'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';" -uroot -ppassword 
mysql -e "GRANT ALL PRIVILEGES on *.* TO 'hyperdude'@'localhost' WITH GRANT OPTION;"  -uroot -ppassword 
