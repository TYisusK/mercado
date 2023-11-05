var ruta = require("express").Router();
var subirArchivo = require("../Middlewares/Middleware").subirArchivo;
var eliminarArchivo = require("../Middlewares/Middleware").eliminarArchivo;
var verificarSesion = require("../Middlewares/verificar");

var {
  mostrarPerfilUsuario,
  nuevoUsuario,
  buscarporID,
  modificarUsuario,
  borrarUsuario,
  iniciarSesion,
} = require("../Database/usuarios");

const Usuario = require("../Models/user");



ruta.get("/nuevousuario", (req, res) => {
  res.render("users/registro");
});

ruta.post("/nuevousuario", subirArchivo(), async (req, res) => {
  req.body.foto = req.file.filename;
  var error = await nuevoUsuario(req.body);
  res.redirect("/login");
});

ruta.get("/editarUsuario/:id", async (req, res) => {
  var user = await buscarporID(req.params.id);
  if (user) {
    res.render("usuarios/modificar", { user });
  } else {
    res.status(404).send("Usuario no encontrado.");
  }
});

ruta.post("/editarusuario", subirArchivo(), async (req, res) => {
  if (req.file != null) {
    req.body.foto = req.file.filename;
  } else {
    req.body.foto = req.body.fotoAnterior;
  }
  var error = await modificarUsuario(req.body);
  res.redirect("/");
});

ruta.get("/borrarUsuario/:id", async (req, res) => {
  try {
    var usuario = await buscarporID(req.params.id);
    if (!usuario) {
      res.status(404).send("Usuario no encontrado.");
    } else {
      var archivo = usuario.foto;
      await borrarUsuario(req.params.id);
      eliminarArchivo(archivo)(req, res, () => {
        res.redirect("/");
      });
    }
  } catch (err) {
    console.log("Error al borrar usuario: " + err);
    res.status(500).send("Error al borrar usuario.");
  }
});

ruta.get("/login", (req, res) => {
    
  res.render("users/login", { error: null });
});

ruta.post("/login", async (req, res) => {
  const datos = req.body;

  console.log("Datos del formulario:", datos); // Agrega esta línea para depurar

  const resultadoInicioSesion = await iniciarSesion(datos);

  if (resultadoInicioSesion.exitoso) {
      // Inicio de sesión exitoso
      res.redirect("/");
  } else {
      // Usuario no encontrado, contraseña incorrecta o error
      console.log("Error de inicio de sesión:", resultadoInicioSesion.mensaje); // Agrega esta línea para depurar
      res.render("users/login", { error: resultadoInicioSesion.mensaje });
  }
});

module.exports = ruta;
