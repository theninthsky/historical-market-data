# Historical Market Data

A wrapper project around the [dukascopy-node](https://www.npmjs.com/package/dukascopy-node) package which saves each day to a CSV file.

![Demo](/images/demo.png)

Each file will have the following columns:
**Timestamp | Ask Price | Bid Price | Ask Volume | Bid Volume**

![CSV](/images/csv.png)

## Installing

```
git clone https://github.com/theninthsky/historical-market-data.git
cd historical-market-data
npm i
```

## Usage

Inside `src/config` there is a configuration file called `parameters.js`, this file will be used during the program's execution.
You should set each value in accordance with your preferences.

`type`: the type of instrument (forex, stocks, crypto)
`instrumentIDs`: an array of instruments to download
`from`: UTC-based date string representing start of the time range
`to`: UTC-based date string representing end of the time range
`timeframe`: timeframe aggregation of OHLC (open, high, low, close) data ('tick', 'm1', 'm3'...)

**Note**: while the end of the time range in [dukascopy-node](https://www.npmjs.com/package/dukascopy-node) is not inclusive, here it is inclusive (i.e. **2020-01-01** to **2020-01-07** will include **2020-01-07**)

To start the program:

```
npm start
```

All of the downloaded data will be in the 'data' folder.
