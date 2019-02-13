var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    
    if(query['cmd'] == 'CalcCharge')
    {
      console.log('Handling a request');
      console.log(query);
      result = serviceCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
    
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
    if (query['checkBal'] == undefined)
      throw Error("Make sure to include a checkBal parameter!");
    
    if(query['savingsBal'] == undefined) 
      throw Error("Make sure to include a savingsBal parameter!");
      
    if(query['checks'] == undefined)  
      throw Error("Make sure to include a checks parameter!");
    
    if(query['checkBal'] == '')
      throw Error('Enter a number for checkBal');
      
    if(query['savingsBal'] == '')
      throw Error('Enter a number for savingsBal');
      
    if(query['checks'] == '')
      throw Error('Enter a number for checks');
    
    if(isNaN(query['checkBal']))
      throw Error('checkBal must be a number');
      
    if(isNaN(query['savingsBal']))
      throw Error('savingsBal must be a number');
      
    if(isNaN(query['checks']))
      throw Error('checks must be a number');
    
    if(query['checkBal'] < 0)
      throw Error('Enter a correct checking balance!');
      
    if(query['savingsBal'] < 0)
      throw Error('Enter a correct savings balance!');
      
    if(query['checks'] < 0)
      throw Error('Enter a correct amount of checks!');
    
    var checking = query['checkBal'];
    var savings = query['savingsBal'];
    var checkNum = query['checks'];
    var charge = .15;
    
    if(checking > 1000 || savings > 1500)
      charge = 0;
      
    else
      charge = charge * checkNum;
      
    var result = {'charge' : charge};
    return result;
}