# SonicX

SonicX is open source high performence light weight router build upon core nodejs http server.
  - simple json based routing.
  - less dependent on third party packages.
  - developer friendly.
  - focus on high performance.

And of course SonicX itself is open source with a [public repository](https://github.com/shiva-rockers/sonicx) on GitHub.

# Features!
  - robust routing.
  - middleware support.
  - mulipart form data support ( file uploads without third party library ).
  - support dynamic routes creation ( /url/:iUserId => access route params from req.params.iUserId ).
  - static file serving.
  - secure transport layer via https.
  
### Installation

SonicX requires [Node.js](https://nodejs.org/) v8+ to run.
```sh
$ npm i sonicx --save
```
### Usage

```sh
const sonicx = require('sonicx');
sonicx.route('/', [
    {
        path: 'user',
        method: 'get',
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

## API
Methods  | Description
------------- | -------------
sonicx.listen(PORT, [, callback ]) | Starts the HTTPS server listening for encrypted connections. This method call `http.createServer(config, handler).listen()` method internally.
sonicx.secureListen(PORT, config,  [, callback ])  | Does same as sonicx.listen but it includes config params for ssl support. This method call `https.createServer(config, handler).listen()` method internally.
sonicx.server | It is a reference of `http.createServer(...) OR https.createServer(...)` depends upon what are listining.
sonicx.configuration | Holds properties to configure the globalserver behaviours. 
sonicx.route(rootPath, [ Routes, ... ]) | Holds routes to be called defined path.

## .server
Reference of http server. can be used to assign as http engine to the third party libraries such as socket.io

Eg.

```sh
const sonicx = require('sonicx');
var io = require('socket.io')(sonicx.server);
```


## Global Configuration [ optional ]
```sh
sonicx.configuration = {
    disableFormdata: false, // if want to use third party form data parser default is true.
    uploadPath: '_uploads', // default upload path default is os.tempDir().
    memoryUpload: true, // if do not want to store in any directory and want to use as buffers.
    requestTimeout: 150000, // miliseconds.
    staticPath: 'public', // Serve static files.
    responseHeaders: {
        "Access-Control-Expose-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    }, // can use to configure cors or other header settings.
};
```

## .route(rootPath, [ Routes, ... ])
 - rootPath : First parameter of route method, which get concate with each path property of routes defined in array.
 - Routes : This is an JSON Object Holds route properties.
   - **path [ *Optional* ]** : get concate with rootPath as postfix and generate full path.
      - Eg.
        ```sh
        sonicx.route('/user' ,[ { path: '/something' , ... } ];
        // -- Result:  '/user' + '/something' = '/user/something';

        sonicx.route('/user/' ,[ { path: 'something' , ... } ];
        // -- Result: '/user/' + 'something' = '/user/something';
        ```
   - **method [ *Optional* ]** : GET, POST, PUT, DELETE is supported. ( case insenstive ).
   - **configuration [ *Optional* ]** : Route level configuration will override the global configuration and has same properties as global configuration does excluding `staticPath` because it must be a global configuration.
   - **middleware(req, res, next) [ *Optional* ]** : Has access of req, res and next. controller will be execute only after calling `next` method if middleware is defined. 
   - **controller(req, res) [ *Required* ]** : Has access of req, res and responsible for writing API logic. 

   Eg.
   ```sh
    sonicx.route('/user', [
        { 
            path : '/login', 
            method: 'post', 
            configuration: {}, 
            middleware: (req, res, next) => { next();}, 
            controller: (req, res) => { res.send({ message: "controller called" } ) },
        },
    ]);
   ```

## Request and Response parameter
 Request and Response parameter has all property of nodejs http server handler does. [http server](https://nodejs.org/api/http.html#http_class_http_server).
 
 Request parameter has some other propertie added such as.
 
 - **req.body** : Contains JSON object sent in body of request from front-end.
 - **req.params** : Contains JSON object fetched from dynamic url path.
   ```
    sonicx.route('/user', [
        { 
            path : '/:iUserId', 
            controller: (req, res) => { res.send({ iUserId: req.params.iUserId" } ) },
        },
    ]);
    // Request url : http://server_ip:server_port/user/1234
    req.params = { iUserId: 1234 };    
   ```
 - **req.query** : Contains JSON object sent in query params in url.
   Eg.
   ```
   // Request url : http://server_ip:server_port/user/1234?name='shiva'&age=23
   req.quey = { name: "shiva", age: 23 }
   ```
 - **req.files** : Holds uploaded files data when requesting from `multipart/form-data`.
    - filename : holds name of the file
    - buffer : buffer of file [ Only when `memoryUpload` is true ]
    - length : length of buffer in bytes [ Only when `memoryUpload` is true ]
    - path : path where files is stored [ Only when `memoryUpload` is false ]

 Response parameter has some other propertie added such as
 ```
// res.send(response:JSON, code:httpStatusCode [Optional], headers:Objects[Optional]);

res.send({ key: "It is SonicX" }, 200, { "Authorization" : "Bearer Token"});
```

## Example
You can find example implementation of sonicx at (github)[]


License
----
ISC

**Free Software, Hell Yeah!**
