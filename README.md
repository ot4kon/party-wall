# party-wall

## TBD:
- testing
- daemonize (systemd / pm2)
- dockerize (with MongoDB)
- change logger to winston
- inline todos

## Running:
To run create .env file in project root, that points to your MongoDB instance and sets JWT_KEY, example:

```
MONGO_HOST="localhost"
MONGO_PORT=27017
MONGO_DB_NAME="party-wall"
JWT_KEY="PartyWall"
PORT=3000
```

Then:
```
npm run start
```
