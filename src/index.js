import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import dukascopyNode from 'dukascopy-node'

import './patch.js'
import parameters from './config/parameters.js'
import instruments from './instruments.js'

const { getHistoricRates } = dukascopyNode
const { instrumentIDs, fromDate = '1900-01-01', toDate = new Date(), timeframe } = parameters

const fetch = async (instrumentIDs, fromDate, toDate, timeframe) => {
  console.log('Downloading...\n')

  for (const instrumentID of instrumentIDs) {
    const { name, description, minStartDate } = instruments[instrumentID]
    const startDate = new Date(minStartDate)

    startDate.setDate(startDate.getDate() + 1) // actual start day is the day after minStartDay

    const date = fromDate > startDate ? new Date(fromDate) : startDate
    const [symbol] = name.match(/(.+?(?=\.))/) || [name.replace('/', '-')]
    const companyName = description.toTitleCase().replace('VS', 'X')
    const folderPath = `data/[${symbol}] ${companyName}`

    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true })

    while (date <= toDate) {
      const fromDateFormatted = date.toISOString().slice(0, 10)

      date.setDate(date.getDate() + 1)

      const toDateFormatted = date.toISOString().slice(0, 10)

      try {
        const data = await getHistoricRates({
          instrument: instrumentID,
          dates: {
            from: fromDateFormatted,
            to: toDateFormatted,
          },
          timeframe,
        })

        if (data.length) {
          const filePath = `${folderPath}/${fromDateFormatted}.csv`

          writeFile(filePath, data.map(row => row.join()).join('\n')).then(() =>
            console.log(`[${symbol}] ${companyName} ${fromDateFormatted} ✔`),
          )
        } else {
          console.log(`[${symbol}] ${companyName} ${fromDateFormatted} ❌ (no data)`)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

fetch(instrumentIDs, new Date(fromDate), new Date(toDate), timeframe)
