var express = require('express')
var hljs = require('highlight.js')

var md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: 'language-',
    highlight: function(str, lang){
        if(lang && hljs.getLanguage(lang)){
            try{
                const preCode = hljs.highlight(lang, str, true).value
                const lines = preCode.split(/\n/).slice(0, -1)
                let ht = lines.map((item, index) => {
                    return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
                }).join('')
                ht = '<ol>' + ht + '</ol>'
                if(lines.lenght){
                    ht += '<b class="name">' + lang + '</b>'
                }
                return '<pre class="hljs"><code>' + ht + '</code></pre>'
            }catch(__){}
        }
        const preCode = md.utils.escapeHtml(str)
        const lines = preCode.split(/\n/).slice(0, -1)
        let ht = lines.map((item, index) => {
            return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
        }).join('')
        ht = '<ol>' + ht + '</ol>'
        return '<pre class="hljs"><code>' + ht + '</code></pre>'
    }
}).use(require('markdown-it-github-headings'), {
    className : 'anchor',
    prefixHeadingIds: true,
    prefix: '',
    enableHeadingLinkIcons: true,
    // linkIcon: '', // './public/img/favicon.ico',
    resetSlugger: true
}).use(require('markdown-it-emoji')).use(require('markdown-it-toc'))

var ObjectID = require('mongodb').ObjectID
var Article = require('./models/article')

var log4js = require('log4js')
log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] (%c) (%h) --> %X{ip}: %m%]%n'
            }
        },
        infoLogs: {
            type: 'file',
            filename: './logs/access.log',
            maxLogSize: 1048576, // file max size.
            backup: 5, // file can save number.
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] (%c) (%h) --> %X{ip}: %m%n'
            }
        }
    },
    categories: {
        default: {
            appenders: ['out', 'infoLogs'],
            level: 'INFO'
        }
    }
})

const logger = log4js.getLogger()
logger.addContext('ip', 'localhost');
logger.info('Start the server.')

var router = express.Router()

var isPC = function(req){
    if(req){
        var deviceAgent = req.headers["user-agent"].toLowerCase()
        // return !(deviceAgent.match(/(iphone|ipod|ipad|android)/))
        return 1
    }else{
        return 1
    }
}

router.get('/', function(req, res) { // get inedx --> get welcome ?
    if(isPC(req)){
        console.log(req.url)
        res.redirect('/welcome');
    }else{
        res.render('index.html')
    }
})

router.get('/welcome', function(req, res) { // get welcome
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.info('GET-' + req.url)

        res.render('welcome.html')
    }else{
        res.render('index.html')
    }
})

router.get('/timeline', function(req, res) { // get timeline
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.info('GET-' + req.url)
        // sort by release_time so that the date form new to old.
        Article.find({}, null, {sort:[['_id', -1]]}, function(err, data){
            if(!err){
                data.forEach(function(item, index){
                    // item._id.toHexString()
                    item.content = item.content.slice(0, 200)
                    item.content = md.render( item.content )
                })
                
                res.render('timeline.html',{
                    article : data
                })
            }
        })
    }else{
        res.render('index.html')
    }
})

router.get('/article/*', function(req, res) { // get article
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);

        var artid = req.query.id
        try{
            Article.findOne({_id : ObjectID(artid)}, function(err, data){
                if(data){
                    logger.info('GET-' + req.url)
                    data.content = md.render( data.content )
                    res.render('article.html',{
                        article : data
                    })
                }else{
                    logger.warn('GET-' + req.url)
                    res.redirect('/404');
                }
            })
        } catch(e) {
            logger.warn('GET-' + req.url)
            logger.error(e)
            res.redirect('/404');
        }

    }else{
       res.render('index.html') 
    }
})

router.get('/about', function(req, res) { // get about
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.info('GET-' + req.url)

        res.render('about.html')
    }else{
        res.render('index.html') 
    }
})

router.get('/mesgboard', function(req, res) { // get mesgboard
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.info('GET-' + req.url)

        Liuyan.find ({}, function (err, data) {
            if (!err) {
                res.render('mesgboard.html', {
                    liuyan: data.reverse()
                })
            }
        })
    }else{
        res.render('index.html') 
    }
})

router.get('/friends', function(req, res) { // get friends
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.info('GET-' + req.url)

        res.render('friends.html')
    }else{
        res.render('index.html') 
    }
})

router.get('/404', function(req, res) {
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.info('GET-/404')

        res.render('404.html')
    } else {
        res.render('index.html')
    }
})

router.get('*', function(req, res) { // other
    if(isPC(req)){
        var ip = req.header('x-forwarded-for')
        logger.addContext('ip', ip);
        logger.warn('GET-' + req.url)
        res.redirect('/404');
    }else{
        res.render('index.html') 
    }
})

module.exports = router
