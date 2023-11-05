// verificarSesion.js

module.exports =function verificarSesion(req, res, next) {
    const sesion = req.cookies.sesion; // Esto debe coincidir con el nombre de la cookie que estableciste

    if (sesion) {
        // Verifica la validez de la sesión (por ejemplo, verifica si el token es válido)
        // Si es válido, puedes permitir el acceso a la ruta
        next();
    } else {
        // Si no hay sesión válida, redirige al usuario a la página de inicio de sesión
        res.redirect('/login');
    }
}

 