sudo mysql -e 'DROP DATABASE hyperdb;' -uroot -ppassword
# sudo mysql -e 'DROP DATABASE sekesitest;' -uroot -ppassword

sudo mysql -e 'CREATE DATABASE hyperdb;' -uroot -ppassword
# sudo mysql -e 'CREATE DATABASE sekesitest;' -uroot -ppassword

# sudo mysql -uroot -ppassword sekesidb < server/sql_scripts/define_db.sql
# sudo mysql -uroot -ppassword sekesitest < server/sql_scripts/define_db.sql

sudo mysql -e "CREATE USER 'hyperdude'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';" -uroot -ppassword
sudo mysql -e "GRANT ALL PRIVILEGES on *.* TO 'hyperdude'@'localhost' WITH GRANT OPTION;"  -uroot -ppassword
