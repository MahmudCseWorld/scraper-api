# Run the scraper

- Put your `aribnb/vrbo` links in a JSON file and rename it `urls.json`.

  Example:

  ```js
  {
    "urls": [
      "https://www.vrbo.com/6815732ha",
      "https://www.vrbo.com/6181418ha",
      "https://www.vrbo.com/511893",
      "https://www.vrbo.com/4856932",
      ....
    ]
  }
  ```

- Run `cli` command to start the scraper

```bash
$ yarn start:controller --site=airbnb --urls=./urls.json --proxies=./proxies.json --start=10 --end=200
```

## CLI options

| Arguments | Description                                           | value                                      |
| --------- | ----------------------------------------------------- | ------------------------------------------ |
| site      | Site name that you want to scrape.                    | `airbnb` / `vrbo`                          |
| urls      | A JSON file with a list of links                      | JSON                                       |
| proxies   | A JSON file with a list of proxies                    | JSON                                       |
| start     | Starting number from where you want to start scraping | Any number. Default is set to `0`.         |
| end       | End number on where you to stop scraping              | Any number. Default is the length of urls. |

# Add proxy

To Add proxies create a new json file `proxies.json` and put your proxies in this format

```json
{
  "proxies": [
    { "address": "x.x.x.x", "port": y, "username": "z", "password": "z" },
    { "address": "x.x.x.x", "port": y, "username": "z", "password": "z" }
  ]
}
```
