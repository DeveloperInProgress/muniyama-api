function getQuery(url){
    var table = url.params.eventName;
    var query = "select * from "+table;
    if(Object.keys(url.query).length==0)
        return query;
    query+=" where";
    for(var key in url.query){
        if(key === "fromBlock")
            query += " block_num>= "+url.query[key]+" and";
        else if(key === "toBlock")
            query += " block_num<= "+url.query[key]+" and";    
        else 
            query += " "+key+" = ANY(ARRAY["+url.query[key]+"]) and";
    }
    return query.slice(0,-4);
}

module.exports={getQuery:getQuery};