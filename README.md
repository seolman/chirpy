# Web Server

## Goals of This Course
- Understand what web servers are and how they power real-world web applications
- Build an actual web server in TypeScript, without the use of a framework
- Learn what makes TypeScript a great language for building fast web servers
- We'll use production-ready tools for everything in this course

*Node.js* server handle many requests at once by *async event loop*.
Most web servers are CRUD apps and *I/O bound* workloads are handled great.
A benefit of single-threaded server is that you don't need to worry about multiple threads accessing shared memory.
The event loop will handle it.

A fileserver is a simple web server that serves static files.
Fileserver often serve static assets for website, things like HTML, CSS, Javascript, Images.

*Express.js* handlers take Request and Response.
Request contains all information about incoming request like HTTP method, path, headers, and body.
Response write response to Response object instead of returning a value all at once.

```js
// register middleware
app.use()
```

```js
// apply to specific routes
app.get("<path>", middlewareLogging, handlerGetUsers)
```

