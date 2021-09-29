var mongoose = require('mongoose')

// link mongodb
var Amodel = mongoose.createConnection('mongodb://localhost/Acticles',{
                useNewUrlParser : true,
                useUnifiedTopology:true,
                useFindAndModify: false,
                useCreateIndex: true
            })

var ASchema = mongoose.Schema

var articleSchema = new ASchema({
    title:{
        type: String,
        require: true
    },
    content:{
        type: String,
        require: true
    },
    release_time:{
        type: Date,
        default: Date.now
    },
    edit_time:{
        type: Date,
        default: Date.now
    }
})

// var Amodel = mongoose.model('Article', articleSchema)

module.exports = Amodel.model('Article', articleSchema)
