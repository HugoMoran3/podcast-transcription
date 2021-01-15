const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const uploadFile = require('./helpers/helpers.js')

const app = express()

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // limited to 5mb currently
    fileSize: 5 * 1024 * 1024,
  },
})

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/uploads', async (req, res, next) => {
  try {
    const myFile = req.file
    console.log("Attempting to upload file");
    const imageUrl = await uploadFile(myFile)

    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
})

app.get('/test/', function(req, res){
  res.send("Hello from the 'test' URL");
});

app.use((err, req, res, next) => {
  console.log("Status 500");
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

app.listen(9001, () => {
  console.log('app now listening for requests!!!')
})