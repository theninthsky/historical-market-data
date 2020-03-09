# Historical Market Data

A wrapper project around the [dukascopy-node](https://www.npmjs.com/package/dukascopy-node) package which saves each day to a CSV file.

![Demo](/images/demo.png)

Each file will have the following columns:
**Timestamp | Ask Price | Bid Price | Ask Volume | Bid Volume**

## Installing

```
git clone https://github.com/theninthsky/historical-market-data.git
cd historical-market-data
npm i
```

## Usage

The Node.js version required to run this program is 10.12.0 or above, since this version introduced recursive directory creation.

Inside `src/config` there is a configuration file called `parameters.js`, this file will be used during the program's execution.
You should set each value in accordance with your preferences.

`instrumentIDs`: an array of instruments to download

`from`: UTC-based date string representing start of the time range

`to`: UTC-based date string representing end of the time range

`timeframe`: timeframe aggregation of OHLC (open, high, low, close) data ('tick', 'm1', 'm3'...)

**Note**: while the end of the time range in [dukascopy-node](https://www.npmjs.com/package/dukascopy-node) is not inclusive, here it is (i.e. **2020-01-01** to **2020-01-07** will include **2020-01-07**)

There is also a `instrument-map.js` file inside `src/config`, this file contains a better formatted names for various instruments.
A good source of formatted names is [Yahoo Finance](https://finance.yahoo.com/).

These mapped names will be used for naming folders.

To start the program:

```
npm start
```

All of the data will be downloaded to the 'data' folder.
