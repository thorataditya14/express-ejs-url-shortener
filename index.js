const express = require('express')
const app = express()
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const ShortUrl = require('./models/shortUrl')

mongoose.connect(
    process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => {
        console.log("Database connected successfully!");
    }
);


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});