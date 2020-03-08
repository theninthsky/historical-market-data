const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { getHistoricRates } = require('dukascopy-node')
const moment = require('moment')

require('./util/capitalize')

const {
  type,
  instrumentIDs,
  from,
  to,
  timeframe
} = require('./config/parameters')
const stocksMap = require('./config/stocks-map')

const fetch = async (type, instrumentIDs, from, to) => {
  const date = moment(from)

  for (const instrumentID of instrumentIDs) {
    const instrumentName =
      stocksMap[type][instrumentIDs] || instrumentID.toUpperCase()

    const folderPath = `data/${type.capitalize()}/${instrumentName}/${date.format(
      'YYYY'
    )}`

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }

    while (date.isSameOrBefore(to)) {
      const format = 'YYYY-MM-DD'

      const fromDate = date.format(format)
      const toDate = moment(fromDate)
        .add(1, 'day')
        .format(format)

      const filePath = `data/${type.capitalize()}/${instrumentName}/${date.format(
        'YYYY'
      )}/${fromDate}.csv`

      try {
        console.log(
          `Downloading ${instrumentName.split`] `[1] ||
            instrumentName} ${fromDate}...`
        )

        const data = await getHistoricRates({
          instrument: instrumentID,
          dates: {
            from: fromDate,
            to: toDate
          },
          timeframe
        })

        if (data.length) {
          console.log('Succeeded\n')

          writeFileSync(filePath, data.map(row => row.join()).join`\n`)
        } else {
          throw Error('no data')
        }
      } catch ({ message }) {
        console.error(`Failed: ${message}\n`)
      }

      date.add(1, 'day')
    }
  }
}

fetch(type, instrumentIDs, from, to, timeframe)
