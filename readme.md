# Server Sent Events Application

This project demonstrates how to use [Server Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) to implement a real time flight timetable. The table shows a list of flight arrivals and updates their state by receiving notifications from the server.

Blog post and in-depth tutorial available here: [Developing Real-Time Web Applications with Server-Sent Events](https://auth0.com/blog/developing-real-time-web-applications-with-server-sent-events/)

The project consists of two applications:

- a React application (the client)
- a Node.js application (the server)

Run the server by opening a command window and typing the following command in the `server` folder:

```shell
node server.js
```

Run the client by opening a command window and typing the following commands in the `client` folder:

```shell
npm install
npm start
```

