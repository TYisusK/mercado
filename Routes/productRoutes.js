var ruta = require("express").Router();
//var subirArchivoProd = require("../middlewares/middleware").subirArchivoProd;
var eliminarArchivoProd = require("../Middlewares/Middleware").eliminarArchivoProd;
var {subirArchivoProd} = require ("../Middlewares/Middleware");
var {mostrarProductos,agregarNuevoProducto,buscarProductoPorID,modificarProducto,borrarProducto} = require("../Database/productos");
const Producto = require("../Models/prod");

ruta.get("/", async (req, res) => {
    var productos = await mostrarProductos();
    console.log(productos);
    res.render("prods/inicio", { productos });
});

ruta.get("/nuevoproducto", (req, res) => {
    res.render("prods/nuevoproducto");
});

ruta.post("/nuevoproducto",subirArchivoProd(), async (req, res) => {
    //console.log(req.file.originalname);
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error = await agregarNuevoProducto(req.body);
    res.redirect("/");
});

ruta.get("/editarProducto/:id", async (req, res) => {
    //console.log(req.params.id);
    var producto = await buscarProductoPorID(req.params.id);
    res.render("productos/modificarP", { producto });
    //res.end();
});

ruta.post("/editarproducto",subirArchivoProd(), async (req, res) => {
    req.body.foto = req.file.originalname;
    var error = await modificarProducto(req.body);
    res.redirect("/productos");
});


ruta.get("/borrarProducto/:id", async (req, res) => {
    try {
        var producto = await buscarProductoPorID(req.params.id);
        if (!producto) {
          res.status(404).send("Usuario no encontrado.");
        } else {
          var archivo = producto.foto;
          await borrarProducto(req.params.id);
          eliminarArchivoProd(archivo)(req, res, () => {
            res.redirect("/productos");
          });
        }
      } catch (err) {
        console.log("Error al borrar usuario" + err);
        res.status(400).send("Error al borrar usuario.");
      }
})




module.exports = ruta;
