const {Pool, Client} = require("pg");

async function retrieveResult (query, callback) { 
    const client = new Client({
        user: "postgres",
        host: "muniyama.cr1fxku2h1oq.us-east-2.rds.amazonaws.com",
        password: "20041999",
        port: 5432
    });
    client.connect()
    var response = {"data":null, "error":null}
    client.query(query, (err,res)=>{
        if(err){
            response["error"] = err;
        }else{
            response["data"] = res.rows;
        }
        callback(response);
    });
}

module.exports = {retrieveResult:retrieveResult}