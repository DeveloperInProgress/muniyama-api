var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var qb = require('./query_builder.js');
var rp = require("./result_processor.js");

app.get("/events/:eventName", (req,res)=>{
    var query = qb.getQuery(req);
    rp.retrieveResult(query,(response)=>{
        //console.log(response);
        res.send(JSON.stringify(response));
    });
})

var server = app.listen(8080, ()=>{
    console.log("listening at port "+8080);
})