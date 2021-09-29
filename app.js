var express = require('express')
var router = require('./routes')
var path = require('path')
var bodyParser = require('body-parser')
const favicon = require('serve-favicon')

var app = express();

app.use('/public/', express.static(path.join(__dirname, 'public')))
app.use('/node_modules/', express.static(path.join(__dirname, 'node_modules')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views')) // default is views

app.use(bodyParser.urlencoded({extended: false})) // use encode form
app.use(bodyParser.json())

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(router) // use router

app.listen(3000, function(){
    console.log('Server is running on 3000...')
})