# Historical Market Data

A wrapper project around the [dukascopy-node](https://www.npmjs.com/package/dukascopy-node) package which saves each exchange day to a separate CSV file.

![Demo](/images/demo.png)

## Installing

```
git clone https://github.com/theninthsky/historical-market-data.git
cd historical-market-data
npm i
```

## Usage

In the `config` folder there is a file called `parameters.ts`, this file will be used during the program's execution.
You should set each value in accordance with your preferences.

`instrumentIDs`: an array of instruments to download

`from`: UTC-based date string representing start of the time range

`to`: UTC-based date string representing end of the time range

`timeframe`: timeframe aggregation of OHLC (open, high, low, close) data ('tick', 'm1', 'm3'...)

**Note**: while the end of the time range in [dukascopy-node](https://www.npmjs.com/package/dukascopy-node) is not inclusive, here it is (i.e. **2020-01-01** to **2020-01-07** will include **2020-01-07**)

To start the program:

```
npm start
```

All of the data will be downloaded to the 'data' folder.
