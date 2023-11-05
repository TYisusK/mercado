var express = require("express");
var path = require("path");
var cors = require('cors');
var app = express(); // Utiliza la variable 'app' aquí


var usuariosRutas = require("./Routes/userRoutes");
var productosRutas = require("./Routes/productRoutes");
var usuariosRutasApi = require("./Routes/userApis");
var productosRutasApi = require("./Routes/productApis");

app.set("view engine", "ejs");
app.set('Views', path.join(__dirname, 'Views')); // En lugar de app.set('/Views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/Web', express.static(path.join(__dirname, 'Web')));
app.use(cors());
app.use("/", usuariosRutas, productosRutas, usuariosRutasApi, productosRutasApi);

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Servidor en http://localhost:" + port);
});
