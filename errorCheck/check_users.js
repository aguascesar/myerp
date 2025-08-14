// Verificar usuarios en localStorage
const users = JSON.parse(localStorage.getItem('usuarios') || '[]');
console.log('Usuarios en localStorage:', users);

// Verificar si el servicio de usuarios está cargado
if (typeof usuarioService !== 'undefined') {
    console.log('Servicio de usuarios cargado correctamente');
    console.log('Usuarios desde el servicio:', usuarioService.obtenerUsuarios());
} else {
    console.error('El servicio de usuarios no está disponible');
}
