const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { getHistoricRates } = require('dukascopy-node')
const moment = require('moment')

require('./util/capitalize')

const { instrumentIDs, from, to, timeframe } = require('./config/parameters')
const instrumentMap = require('./config/instrument-map')

const typeByID = require('./lib/type-by-id')

const fetch = async (instrumentIDs, from, to) => {
  for (const instrumentID of instrumentIDs) {
    const type = typeByID(instrumentID)

    const date = moment(from)

    const instrumentName =
      instrumentMap[type][instrumentID] || instrumentID.toUpperCase()

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

fetch(instrumentIDs, from, to, timeframe)
