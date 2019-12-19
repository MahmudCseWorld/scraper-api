# Run the scraper api

- CD into scraper
- Run `yarn start`
- To run in docker
  ```bash
  $ ENV_FILE=.env docker-compose -f docker-compose.yml up --build
  ```

## ENV variables

```bash
AUTHORIZATION=YOUR AUTHORIZATION SECRET
```

# Run the controller

- CD into `controller`
- Put your `aribnb` links in a JSON file and rename it `urls.json`.

  Example:

  ```js
  {
    "urls": [
      "https://www.airbnb.com/rooms/7942637",
      "https://www.airbnb.com/rooms/30258897",
      ....
    ]
  }
  ```

- Run `cli` command to start the controller

```bash
$ DEBUG=controller yarn start --proxies=./proxies.json --start=1 --end=20 --api=http://localhost:3000/api/scraper
```

- Make CSV from Database records

```bash
$ DEBUG=make-csv node make-csv.js
```

## CLI options

| Arguments | Description                                           | Type   |
| --------- | ----------------------------------------------------- | ------ |
| urls      | A JSON file with a list of links                      | JSON   |
| proxies   | A JSON file with a list of proxies                    | JSON   |
| start     | Starting number from where you want to start scraping | Number |
| end       | End number on where you to stop scraping              | Number |
| api       | API endpoint                                          | String |

## Add proxy

To Add proxies create a new json file `proxies.json` and put your proxies in this format

```json
{
  "proxies": [
    { "address": "x.x.x.x", "port": y, "username": "z", "password": "z" },
    { "address": "x.x.x.x", "port": y, "username": "z", "password": "z" }
  ]
}
```

## ENV variables

```bash
AUTHORIZATION=YOUR AUTHORIZATION SECRET
MONGO_URL=YOUR MONGODB URL
```
