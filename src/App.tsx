import * as React from 'react'
import * as Papa from 'papaparse'

interface MonthsMap {
  [key: string]: number
}

const monthsMap: MonthsMap = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const parseTransactions = (csvString: string) => {
  const parsed = Papa.parse(csvString)
  const newCsvString: Array<Array<string>> = []

  // Add header
  newCsvString.push(['Date', 'Payee', 'Outflow', 'Inflow'])

  parsed.data.forEach(line => {
    const possibleDate = line[0].split(' ')
    if (possibleDate.length !== 3) {
      return
    }

    let newTransactionLine = []

    const dayNo: string = possibleDate[0]
    const monthNo: string = String(monthsMap[possibleDate[1]] + 1)
    const yearNo: string = possibleDate[2]

    const transactionDate = `${monthNo.padStart(2, '0')}/${dayNo.padStart(
      2,
      '0'
    )}/${yearNo}`
    const dateRe = /(((0)[0-9])|((1)[0-2]))(\/)([0-2][0-9]|(3)[0-1])(\/)\d{4}$/

    if (!transactionDate.match(dateRe)) {
      return
    }

    newTransactionLine = [
      transactionDate,
      line[6],
      line[4].trim(),
      line[5].trim(),
    ]
    newCsvString.push(newTransactionLine)
  })

  const newCsvData = Papa.unparse(newCsvString)

  const downloadLink = document.createElement('a')
  downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(newCsvData)
  downloadLink.download = 'data.csv'

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

const onChange = (e: React.FormEvent<HTMLInputElement>) => {
  if (e && e.currentTarget && e.currentTarget.files) {
    const file: File = e.currentTarget.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      if (reader.result) {
        const result: string = String(reader.result)
        parseTransactions(result)
      }
    }
  }
}

const App = () => (
  <div>
    <input type="file" onChange={onChange} />
  </div>
)

export default App
