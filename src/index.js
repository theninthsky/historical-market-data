import { existsSync, mkdirSync, writeFileSync } from 'fs'
import dukascopyNode from 'dukascopy-node'

import './patch.js'
import parameters from './config/parameters.js'
import instruments from './instruments.js'

const { getHistoricRates } = dukascopyNode
const { instrumentIDs, fromDate = '1900-01-01', toDate, timeframe } = parameters

const fetch = async (instrumentIDs, fromDate, toDate, timeframe) => {
  for (const instrumentID of instrumentIDs) {
    const { name, description } = instruments[instrumentID]
    const [symbol] = name.match(/(.+?(?=\.))/) || [name.replace('/', '-')]
    const companyName = description.toTitleCase().replace('VS', 'X')
    const folderPath = `data/[${symbol}] ${companyName}`

    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true })

    console.log(`Downloading [${symbol}] ${companyName} data...\n`)

    const data = await getHistoricRates({
      instrument: instrumentID,
      dates: {
        from: fromDate,
        to: toDate || new Date().toISOString().slice(0, 10),
      },
      timeframe,
    })

    if (data.length > 2) {
      const dataObject = {}

      data.forEach(row => {
        const date = new Date(row[0]).toISOString().slice(0, 10)

        if (!dataObject[date]) dataObject[date] = []

        dataObject[date].push(row.toString())
      })

      for (const day in dataObject) {
        const filePath = `${folderPath}/${day}.csv`

        writeFileSync(filePath, dataObject[day].join('\n'))

        console.log(`${day} ✔`)
      }
    } else {
      console.log('No data ❌')
    }

    console.log()
  }
}

fetch(instrumentIDs, fromDate, toDate, timeframe)
