// import path from 'path'
import express from 'express'
// import cors from 'cors'
// import nunjucks from 'nunjucks'
import compression from 'compression'
import helmet from 'helmet'
import { Configuration, OpenAIApi } from "openai"
import { ChatGPTAPI } from 'chatgpt'

const router = express.Router()
const app = express()

router.post("/conversation", async (req, res) => {
  let response
  // ensure the API is properly authenticated
  console.log(req.get("authorization"))
  try {
    const api = new ChatGPTAPI({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      sessionToken: req.body.key,
      clearanceToken: req.body.clearanceToken
    })
    await api.ensureAuth()
    // send a message and wait for the response
    response = await api.sendMessage(req.body.msg || '')
  } catch(err) {
    response = "Ooop：" + err
  }

  res.json({
    code: 200,
    msg: "success",
    data: {
      txt: response
    }
  })
})

router.post("/open", async (req, res) => {
  let response
  try {
    const configuration = new Configuration({
      apiKey: req.body.key,
    })
    const openai = new OpenAIApi(configuration)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.msg || '',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    response = completion.data.choices[0].text
  } catch(err) {
    response = "Ooop：" + err
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
// app.use(cors())
//开启json解析
app.use(express.json())
app.use("/api", router)

app.get("/", async (req, res) => {
  res.type('html')
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

app.listen(3000, () => console.log(`app listening on port 3000!`))
