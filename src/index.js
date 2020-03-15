const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { getHistoricRates } = require('dukascopy-node')
const moment = require('moment')

const { instrumentIDs, from, to, timeframe } = require('../config')
const { instruments } = require('dukascopy-node/lib/config/instruments')

const fetch = async (instrumentIDs, from = '0000-00-00', to = Date.now()) => {
  for (const instrumentID of instrumentIDs) {
    const { name, description, minStartDate } = instruments[instrumentID]

    const date = moment(
      moment(from).isSameOrAfter(minStartDate) ? from : minStartDate,
    )

    const [symbol] = name.match(/(.+?(?=\.))/) || [name.replace('/', '-')]
    const companyName = description.toUpperCase().replace('VS', 'X')

    const folderPath = `data/[${symbol}] ${companyName}/${date.format('YYYY')}`

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }

    while (date.isSameOrBefore(to)) {
      const format = 'YYYY-MM-DD'

      const fromDate = date.format(format)
      const toDate = moment(fromDate)
        .add(1, 'day')
        .format(format)

      const filePath = `${folderPath}/${fromDate}.csv`

      try {
        console.log(`Downloading ${companyName} ${fromDate}...`)

        const data = await getHistoricRates({
          instrument: instrumentID,
          dates: {
            from: fromDate,
            to: toDate,
          },
          timeframe,
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
