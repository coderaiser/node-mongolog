(function() {
    'use strict';
    
    var shortdate = require('shortdate');
    
    module.exports = function(options) {
        check(options);
            
        if (!options.name)
            options.name = 'mongolog';
        
        return middle.bind(null, options);
    };
    
    function middle(options, req, res, next) {
        var collection  = options.db.collection(options.name),
            date        = shortdate(),
            ip          = req.connection.remoteAddress,
            url         = req.url,
            data        = {ip: ip, date: date};
        
        collection.findOne(data, function(e, doc) {
            var is,
                count   = 1;
            
            if (!error(e, next))
                if (!doc) {
                    collection.insert(init(ip, date, url), next);
                } else {
                    is = doc.urls.some(function(item) {
                        var is = item.url === url;
                        
                        if (is)
                            count = 1 + item.count;
                        
                        return is;
                    });
                    
                    if (is)
                        collection.update({ip: ip, date: date, 'urls.url': url}, {
                            $set: {
                                'urls.$.count' : count
                            }
                        }, next);
                    else
                        collection.update({ip: ip, date: date}, {
                            '$push': {
                                urls: {
                                    url     : url,
                                    count   : count
                                }
                            }
                        }, next);
                }
            });
    }
    
    function error(e, fn) {
        e && fn(e);
        return e;
    }
    
    function init(ip, date, url) {
        var data = {
            ip      : ip,
            date    : date,
            urls    : [{
                url     : url,
                count   : 1
            }]
        };
        
        return data;
    }
    
    function check(options) {
        if (!options)
            throw(Error('options could not be empty!'));
        
        if (!options.db)
            throw(Error('options.db could not be empty!'));
    }
})();
