# Development
```
$ npm i -g dotenv-cli
$ yarn or npm install
$ dotenv -e .env yarn start:scraper
```
## Run scraper in docker
```
$ ENV_FILE=.env docker-compose -f docker-compose.yml up --build
```

# Run controller 
 ```bash
 $ dotenv -e .env yarn start:controller
 ```

# Setting Environment Variables
```
AUTHORIZATION=
MONGO_URL=
PORT=
API_URL=
```