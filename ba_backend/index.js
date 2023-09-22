const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const stationRoutes = require("./routes/station");
const port = 8000;
const { createProxyMiddleware } = require('http-proxy-middleware');

// app.use(
//   '/emap',
//   createProxyMiddleware({
//     target: 'http://localhost:3000',
//     changeOrigin: true,
//   })
// );



app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


require("./routes/station")(app);
require("./routes/choropleth")(app);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
