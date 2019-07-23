const os = require('os');
const fs = require('fs');
const url = require('url');
const http = require('http');
const Dicer = require('dicer');
const queryString = require('querystring');

function Route(middleware, controller, schema = {}, configuration = {}) {
    this.middleware = middleware;
    this.controller = controller;
    this.schema = schema;
    this.configuration = {
        uploadPath: configuration.uploadPath ? configuration.uploadPath : os.tmpdir(),
        memoryUpload: typeof configuration.memoryUpload === 'boolean' ? configuration.memoryUpload : false,
        requestTimeout: configuration.requestTimeout || 120000,
        responseHeaders: Object.entries(configuration.responseHeaders || {}) || [],
        disableFormdata: configuration.disableFormdata ? configuration.memoryUpload : false,
    }
}

Route.prototype.run = function (req, res) {
    if (this.middleware) this.middleware(req, res, () => this.controller(req, res));
    else this.controller(req, res);
}

function Router() {
    this.allowedMethods = ["GET", "POST", "PUT", "DELETE"];
    this.allowedPath = /^([a-zA-Z0-9]+|\/[a-zA-Z0-9]+|\/:[a-zA-Z]+[0-9]*)*$/;
    this.routes = {};
    this.dynamicRoutes = {};
    this.routesProto = [];
}

Router.prototype.validateRoute = function (method, path) {
    if (!this.allowedMethods.includes(method)) return { path, error: true, errorMessage: `Error: ${method} method is not supported. ` };
    const generatedPath = method.concat(path);
    if (this.routesProto.includes(generatedPath)) return { path, error: true, errorMessage: `Error: ${path} conflict ` }
    if (path === "/") return { path: generatedPath, error: false, errorMessage: `` };
    if (!this.allowedPath.test(generatedPath)) return { path, error: true, errorMessage: `Error: ${path} path is not supported. ` };
    return { path: generatedPath, error: false, errorMessage: `` };
}

Router.prototype.add = function (_path, _routes = [], _globalConfiguration) {
    _routes.forEach((_route) => {
        if (!_route.method) _route.method = 'GET';
        const method = _route.method.toUpperCase();
        const { error, errorMessage, path } = this.validateRoute(method, _path.concat(_route.path));
        if (error) return console.error(errorMessage);
        this.routesProto.push(path);
        this.routes[path] = new Route(_route.middleware, _route.controller, _route.schema, { ..._globalConfiguration, ..._route.configuration });
        if (path.includes(':')) {
            const splited = path.split("/");
            if (this.dynamicRoutes[splited.length]) this.dynamicRoutes[splited.length].push({ s: splited, p: path });
            else this.dynamicRoutes[splited.length] = [{ s: splited, p: path }];
        }
    });
}

Router.prototype.getRoute = function (_route) {
    if (_route in this.routes) return { route: this.routes[_route], routeParam: {} };
    else {
        const { dynamicRoute, params } = this.getDynamicRoute(_route);
        if (dynamicRoute in this.routes) return { route: this.routes[dynamicRoute], routeParam: params };
        return false;
    }
}

Router.prototype.execute = function (req, res, _route) {
    if (_route in this.routes) return this.routes[_route].run(req, res);
    else {
        const { dynamicRoute, params } = this.getDynamicRoute(_route);
        req.params = params;
        if (dynamicRoute in this.routes) return this.routes[dynamicRoute].run(req, res);
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Route not found." }));
        return;
    }
}

Router.prototype.getDynamicRoute = function (_route) {
    let dynamicRoute = "";
    let params = {}
    const splitedUrl = _route.split("/");
    const dynamicRoutesLength = this.dynamicRoutes[splitedUrl.length] ? this.dynamicRoutes[splitedUrl.length].length : 0;
    for (let i = 0; i < dynamicRoutesLength; i++) {
        params = {};
        for (let j = 0; j < this.dynamicRoutes[splitedUrl.length][i].s.length; j++) {
            if (!this.dynamicRoutes[splitedUrl.length][i].s[j].includes(":")) continue;
            params[this.dynamicRoutes[splitedUrl.length][i].s[j].substring(1)] = splitedUrl[j];
            this.dynamicRoutes[splitedUrl.length][i].s[j] = splitedUrl[j];
        }
        if (_route !== this.dynamicRoutes[splitedUrl.length][i].s.join("/")) continue;
        dynamicRoute = this.dynamicRoutes[splitedUrl.length][i].p;
        break;
    }
    return { dynamicRoute, params };
}

const router = new Router();

function Server(sonicx, PORT, callback) {
    this.contentTypes = ['application/x-www-form-urlencoded', 'application/json', 'multipart/form-data'];
    sonicx.server = http.createServer((req, res) => {

        const { pathname, query } = url.parse(req.url);
        if (query) req.query = { ...queryString.parse(query) };

        const { route, routeParam } = router.getRoute(req.method.concat(pathname));
        if (routeParam) req.params = routeParam;

        if (!route) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Route not found." }));
            return;
        }

        this.configureRoot(req, res, route.configuration);

        const [contentType] = req.headers['content-type'] ? req.headers['content-type'].split(";") : '';
        if (req.method === 'GET' || !this.contentTypes.includes(contentType)) return route.run(req, res);
        switch (contentType) {
            case 'application/x-www-form-urlencoded': {
                this.listenData(req, (data) => {
                    req.body = { ...queryString.parse(data) };
                    return route.run(req, res);
                });
                break;
            }
            case 'application/json': {
                this.listenData(req, (data) => {
                    try { req.body = JSON.parse(data) } catch (error) { req.body = {} };
                    return route.run(req, res);
                });
                break;
            }
            case 'multipart/form-data': {
                const options = {
                    uploadPath: route.configuration.uploadPath,
                    memoryUpload: route.configuration.memoryUpload,
                    disableFormdata: route.configuration.disableFormdata,
                };
                this.parseData(req, options, ({ body = {}, files = {} }) => {
                    req.body = body;
                    req.files = files;
                    return route.run(req, res);
                });
                break;
            }
            default: req.body = {}; break;
        }
    }).listen(PORT, callback);
}

Server.prototype.configureRoot = function (req, res, configuration) {
    /**
     * Global configuration
     */
    req.files = [];
    res.sendDate = false;
    res.send = (response, code, headers) => {
        if (code || headers) res.writeHead(code || 200, headers || {});
        res.end(JSON.stringify(response));
        if (req.files.length) this.cleanup(req.files);
    }
    /**
     * on request configuration
     */
    for (let i = 0; i < configuration.responseHeaders.length; i++) res.setHeader(configuration.responseHeaders[i][0], configuration.responseHeaders[i][1]);
    res.setTimeout(configuration.requestTimeout, () => {
        res.writeHead(408);
        res.end(JSON.stringify({ error: "Request Timeout" }));
    });
}

Server.prototype.cleanup = (files) => {
    files.forEach((file) => fs.unlink(file.path, () => { }));
}

Server.prototype.listenData = function (req, callback) {
    let data = "";
    req.on('data', chunk => data = data += chunk);
    req.on('end', () => callback(data));
}

Server.prototype.parseData = function (req, options, callback) {
    if (options.disableFormdata) return callback({})
    const RE_BOUNDARY = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i;
    const m = RE_BOUNDARY.exec(req.headers['content-type']);
    if (!m) return callback({});
    const d = new Dicer({ boundary: m[1] || m[2] });
    const objData = {};
    const filesData = {};
    d.on('part', (p) => {
        let key = undefined;
        let file = undefined;
        let filename = '';
        p.on('header', (header) => {
            const splitedContent = header['content-disposition'][0].split(";");
            if (!splitedContent.length) return true;
            key = splitedContent[1].split("=")[1].replace(/['"]+/g, '').trim();
            if (splitedContent.length < 3) return objData[key] = '';
            filename = splitedContent[2].split("=")[1].replace(/['"]+/g, '').trim();
            file = options.memoryUpload ? [] : fs.createWriteStream(options.uploadPath + '/' + filename);
        });

        p.on('data', (data) => {
            if (file) {
                if (options.memoryUpload) file.push(data);
                else file.write(data);
            } else {
                objData[key] += data.toString()
            }
        });

        p.on('end', () => {
            if (!file) return true;
            filesData[key] = { filename };
            if (options.memoryUpload) {
                filesData[key]['buffer'] = Buffer.concat(file);
                filesData[key]['length'] = filesData[key]['buffer'].length;
            }
            else {
                filesData[key]['path'] = options.uploadPath + '/' + filename;
                file.end();
            }
        });
    });
    d.on('finish', () => callback({ body: objData, files: filesData }));
    req.pipe(d)
}

function Sonicx() {
    /**
     * this.server is an instance of http.createServer(), 
     * it will be defined in server class. 
     * */
    this.server = undefined;
    this.configuration = {};
}

Sonicx.prototype.route = function(_path, _routes){
    router.add(_path, _routes, this.configuration);
}

Sonicx.prototype.listen = function(PORT, callback){
    new Server(this, PORT, callback);
}

Sonicx.prototype.SecureListen = function(PORT, config, callback){
    new Server(this, PORT, callback);
}

module.exports = new Sonicx();