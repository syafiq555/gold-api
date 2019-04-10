import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cheerio from 'cheerio'
import axios from 'axios'

// init server
const app = express()


//server middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

//route
app.get('/', async (req, res) => {
  try {
    const { data } = await loadURL('https://goldprice.com/live-gold-prices/')
    const goldPrice = getGoldPrice(data)
    const convertedNumber = await convertNumber(goldPrice)
    const result = formula(convertedNumber)
    return res.status(200).json({ gold_price: result })
  } catch (err) {
    return res.status(500).json({ err: { message: err } })
  }
})

app.listen(3000, () => console.log(`Listening on port http://localhost:3000`))

//formula

const formula = (rm) => parseFloat(rm) / 28.349523125

const loadURL = async (url) => {
  const fetchedHTML = await axios.get(url)
  return fetchedHTML
}

const getGoldPrice = (html) => {
  const $ = cheerio.load(html)
  const myrBlock = $('.symbol-block.myr td.quote-field.ask span.value')
  return myrBlock.text()
}

const convertNumber = (number) => {
  const numberArr = number.split(' ')
  const money = numberArr[1]
  return money.replace(/,/g, '')
}