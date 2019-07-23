# SonicX

SonicX is a high performence light weight router build upon core nodejs http server.
  - simple json based routing
  - less dependent on third party packages
  - developer friendly

# Features!
  - Robust routing
  - middleware support
  - mulipart form data support ( file uploads )
  - support dynamic routes creation
  - Focus on high performance

### Tech

Dependencies used

* [os] - https://nodejs.org/api/os.html
* [fs] - https://nodejs.org/api/fs.html
* [url] - https://nodejs.org/api/url.html
* [http] - https://nodejs.org/api/http.html
* [querystring] - https://nodejs.org/api/querystring.html
* [dicer] - A very fast streaming multipart parser for node.js. https://www.npmjs.com/package/dicer

And of course SonicX itself is open source with a [public repository](https://github.com/shiva-rockers/sonicx) on GitHub.

### Installation

SonicX requires [Node.js](https://nodejs.org/) v8+ to run.
```sh
$ npm i sonicx --save
```
### Get started

```sh
const sonicx = require('sonicx');
sonicx.route('/', [
    {
        path: 'user',
        method: 'get',
        configuration: {},
        middleware: (req, res, next) => { next() },
        controller: (req, res) => {
            res.send({ key: "It is SonicX" });
        }
    },
    {
        path: 'user',
        method: 'post',
        configuration: {},
        middleware: (req, res, next) => { next() },
        controller: (req, res) => {
            res.send({ key: "It is SonicX" });
        }
    },
    {
        path: ':iUserId',
        method: 'post',
        middleware: (req, res, next) => { next() },
        controller: (req, res) => {
            res.send({ key: "It is SonicX" });
        }
    }
]);
sonicx.listen(4000, () => console.log("Listening on 4000"));
```

## Global Configuration [ optional ]
```sh
sonicx.configuration = {
    disableFormdata: false, // if want to use third party form data parser default is true.
    uploadPath: '_uploads', // default upload path default is os.tempDir().
    memoryUpload: true, // if do not want to store in any directory and want to use as buffers.
    requestTimeout: 150000, // miliseconds.
    responseHeaders: {
        "Access-Control-Expose-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    }, // can use to configure cors or other header settings.
};
```

## Route level Configuration [ optional ]
Route level configuration will override the global configuration and has same properties as global configuration does.

## Request and Response parameter
 Request and Response parameter has all property of nodejs http server has. [http server](https://nodejs.org/api/http.html#http_class_http_server).
 
 Request parameter has some other propertie added such as express server has.
 
 - req.body
 - req.params
 - req.query
 - req.files

 Response parameter has some other propertie added such as
 ```
// res.send(response:JSON, code:httpStatusCode [Optional], headers:Objects[Optional]);

res.send({ key: "It is SonicX" }, 200, { "Authorization" : "Bearer Token"});
```

### Todos

 - Support for https.
 - multilayer middlewares support.
 - enhancing properties of request parameters.
 - public file serving support.

License
----
ISC

**Free Software, Hell Yeah!**
