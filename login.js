// Interacciones del prototipo. No guarda ni envía contraseñas.
const formulario = document.querySelector('#formulario-login');
const contrasena = document.querySelector('#contrasena');
const mostrar = document.querySelector('#mostrar-contrasena');
const estado = document.querySelector('#estado');

mostrar.addEventListener('click', () => {
  const visible = contrasena.type === 'password';
  contrasena.type = visible ? 'text' : 'password';
  mostrar.textContent = visible ? 'Ocultar' : 'Mostrar';
  mostrar.setAttribute('aria-pressed', String(visible));
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const usuario = document.querySelector('#usuario');
  if (!usuario.value.trim() || !contrasena.value.trim()) {
    estado.textContent = 'Completa tu usuario y contraseña.';
    (!usuario.value.trim() ? usuario : contrasena).focus();
    return;
  }
  estado.textContent = 'Formulario completo. Esta es una demostración: el inicio de sesión estará disponible al conectar Flask y MySQL.';
});

document.querySelector('#recuperar').addEventListener('click', () => {
  estado.textContent = 'La recuperación de contraseña estará disponible al conectar el servidor.';
});
document.querySelector('#registrar').addEventListener('click', () => {
  estado.textContent = 'La pantalla de registro aún está pendiente de implementar.';
});
document.querySelector('#anio').textContent = new Date().getFullYear();
