Mongolog
=======

[Express](http://expressjs.com "Express") middleware for logging http queries to [mongoDB](http://mongodb.org "MongoDB").

`Mongolog` saves data this way:

```js
{
    ip: '<clients ip address>',
    date: '<short date>',
    urls: {
        url: '<url to resource>',
        count: '<count of requests>'
    }
}
```

`Mongolog` data could be read from command line by [mongolog-cli](https://github.com/coderaiser/node-mongolog-cli "mongolog-cli").

## Install

`npm i mongolog --save`

## Hot to use?

`Mongolog` could be used as express middleware this way.

```js
    
var mongoLog    = require('mongolog'),
    express     = require('express'),
    app         = express(),
    port        = 1337,
    ip          = '0.0.0.0',
    url         =  'mongodb://localhost:27017/mongolog';
    
MongoClient.connect(url, function(error, db) {
    if (error) {
        console.error(error.message);
    } else {
        app.use(mongoLog({
            db  : db,
            name: 'mongolog
        }));
        
        app.use(express.static(__dirname));
        
        http.createServer(app)
            .listen(port, ip);
        
        console.log('url: %s:%s', ip, port);
    }
});
```

## License

MIT

