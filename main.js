// import path from 'path'
import express from 'express'
// import nunjucks from 'nunjucks'
import compression from 'compression'
import helmet from 'helmet'
import { ChatGPTAPI } from 'chatgpt'

const router = express.Router()
const app = express()
// const ChatGPT = require('chatgpt')
const token = ''
router.get("/", async (req, res) => {
  res.set('Content-Type', 'text/html')
  res.send(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="renderer" content="webkit">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
          *{margin:0px;padding:0px}
          body{padding:10px}
        </style>
      </head>
      <body>
        <div id="app">Hello Ode</div>
      </body>
    </html>
    `
  )
})

router.post("/api", async (req, res) => {
  let response
  // ensure the API is properly authenticated
  // console.log(req.get("authorization"))
  try {
    const msg = req.body.msg
    const api = new ChatGPTAPI({
      sessionToken: req.get('authorization').split(' ')[1]
    })
    await api.ensureAuth()
    // send a message and wait for the response
    response = await api.sendMessage(msg)
  } catch(err) {
    response = "Ooop"
  }

  res.json({
    code: 200,
    msg: "success",
    data: {
      txt: response
    }
  })
})
// app.set('view engine', 'html')
// app.set('views', path.resolve(__dirname, './views'))

// nunjucks.configure('views', {autoescape: true, express: app})

// app.use('/statics', express.static('statics'))
app.use(compression())
app.use(helmet())
//开启json解析
app.use(express.json())
app.use("/", router)

app.listen(3000, () => console.log(`Example app listening on port 3000!`))
