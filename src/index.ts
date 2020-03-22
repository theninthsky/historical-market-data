import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { getHistoricRates } from 'dukascopy-node'
import moment from 'moment'

import { instrumentIDs, from, to, timeframe } from '../parameters'
import instruments from './config/instruments'

const fetch = async (
  instrumentIDs: string[],
  from: string = '0000-00-00',
  to: string | number = Date.now(),
  timeframe: string,
) => {
  for (const instrumentID of instrumentIDs) {
    const { name, description, minStartDate } = instruments[instrumentID]

    const date = moment(
      moment(from).isSameOrAfter(minStartDate) ? from : minStartDate,
    )

    const [symbol] = name.match(/(.+?(?=\.))/) || [name.replace('/', '-')]
    const companyName = description.toUpperCase().replace('VS', 'X')

    const folderPath = `data/[${symbol}] ${companyName}`

    while (date.isSameOrBefore(to)) {
      const fullFolderPath = `${folderPath}/${date.format('YYYY')}`

      if (!existsSync(fullFolderPath)) {
        mkdirSync(fullFolderPath, { recursive: true })
      }

      const fromDate = date.format('YYYY-MM-DD')
      const toDate = moment(fromDate)
        .add(1, 'day')
        .format('YYYY-MM-DD')

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
          console.log('Succeeded\n')

          writeFileSync(filePath, data.map(row => row.join()).join('\n'))
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
