# Launch Hypertube:

1. Launch docker container
2. Start DB:
```bash
service mysql start
cd server/sql
bash get_db_from_dump.sh
```
3. Build client:
```bash
cd client
npm i
npm run build
```
4. Start server:
```bash
cd server
gpg -d .env.gpg # create .env from encrypted file - you need the password
```
make sure that in .env: `FRONT_HOST="http://localhost:8071"`\
then:
```bash
npm i
npm start
```
5. Go to the website and enjoy:
```bash
localhost:8071
```
