import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import dukascopyNode from 'dukascopy-node'
import moment from 'moment'

import { instrumentIDs, from, to, timeframe } from '../parameters.js'
import instruments from './config/instruments.js'

const { getHistoricRates } = dukascopyNode

const fetch = async (instrumentIDs, from = '0000-00-00', to = Date.now(), timeframe) => {
  for (const instrumentID of instrumentIDs) {
    const { name, description, minStartDate } = instruments[instrumentID]

    const date = moment(moment(from).isSameOrAfter(minStartDate) ? from : minStartDate)

    const [symbol] = name.match(/(.+?(?=\.))/) || [name.replace('/', '-')]
    const companyName = description.toUpperCase().replace('VS', 'X')

    const folderPath = `data/[${symbol}] ${companyName}`

    while (date.isSameOrBefore(to)) {
      const fullFolderPath = `${folderPath}/${date.format('YYYY')}`

      if (!existsSync(fullFolderPath)) {
        mkdirSync(fullFolderPath, { recursive: true })
      }

      const fromDate = date.format('YYYY-MM-DD')
      const toDate = moment(fromDate).add(1, 'day').format('YYYY-MM-DD')

      const filePath = `${fullFolderPath}/${fromDate}.csv`

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
          writeFile(filePath, data.map(row => row.join()).join('\n')).then(() => console.log('Succeeded\n'))
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
