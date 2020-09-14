import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import dukascopyNode from 'dukascopy-node'

import './patch.js'
import parameters from '../parameters.js'
import instruments from './config/instruments.js'

const { getHistoricRates } = dukascopyNode
const { instrumentIDs, fromDate = '0000-01-01', toDate = new Date(), timeframe } = parameters

const fetch = async (instrumentIDs, fromDate, toDate, timeframe) => {
  console.log(
    `Downloading ${instrumentIDs.join(', ')} from ${fromDate
      .toLocaleDateString('en-GB')
      .slice(0, 10)} to ${toDate.toLocaleDateString('en-GB')}...\n`,
  )

  for (const instrumentID of instrumentIDs) {
    const { name, description, minStartDate } = instruments[instrumentID]

    const date = fromDate >= new Date(minStartDate) ? new Date(fromDate) : new Date(minStartDate)

    const [symbol] = name.match(/(.+?(?=\.))/) || [name.replace('/', '-')]
    const companyName = description.toTitleCase().replace('VS', 'X')

    const folderPath = `data/[${symbol}] ${companyName}`

    while (date <= toDate) {
      const fullFolderPath = `${folderPath}/${date.getFullYear()}`

      if (!existsSync(fullFolderPath)) mkdirSync(fullFolderPath, { recursive: true })

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
          const filePath = `${fullFolderPath}/${fromDateFormatted}.csv`

          writeFile(filePath, data.map(row => row.join()).join('\n')).then(() =>
            console.log(`[${symbol}] ${companyName} ${fromDateFormatted} ✔`),
          )
        } else {
          console.log(`[${symbol}] ${companyName} ${fromDateFormatted} ❌`)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

fetch(instrumentIDs, new Date(fromDate), new Date(toDate), timeframe)
