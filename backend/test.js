const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const path = require('path')

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

//Upload file from server to cloud storage


//Upload file from client to server
app.post('/upload', (req, res) => {

  //Remove previously uploaded files
  const FilePath = './public/audio.mp3';
  fs.unlink(FilePath, (err) => {
    if (err) {
      console.error(err)
      console.log("No file audio.mp3 found")
      return
    }

    console.log("File removed");
  })


  if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
  }
      //Access the file
  const myFile = req.files.file;
  // mv() method places the file inside public directory
  myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
      if (err) {
          console.log(err)
          return res.status(500).send({ msg: "Error occured" });
      }
      //Return the response with file path and name
      const fileName = myFile.name;
      console.log(fileName);
      
      //Path to current file and renamed file
      const pathToFile = path.join(__dirname, "/public/" + fileName)
      const newPathToFile = path.join(__dirname, "/public/audio.mp3")
      
      //Rename file to audio.mp3
      try {
        fs.renameSync(pathToFile, newPathToFile)
        console.log("Successfully renamed the file!")
      } catch(err) {
        throw err
      }


      //var text = fs.readFileSync('audio.mp3', "utf-8");
      //console.log(text);

      return res.send({name: myFile.name, path: `/${myFile.name}`});
  });
})

app.post('/cloudstorage', async (req, res, next) => {
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

app.use((err, req, res, next) => {
  console.log("Status 500");
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

app.listen(4500, () => {
  console.log('app now listening for requests on 4500')
})