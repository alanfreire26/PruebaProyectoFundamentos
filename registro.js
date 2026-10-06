// Edad mínima acordada para el proyecto.
// Flask deberá repetir todas las validaciones y comprobar usuario único.
const EDAD_MINIMA = 16;

function calcularEdad(fecha, hoy = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const nacimiento = new Date(0);
  nacimiento.setFullYear(anio, mes - 1, dia);
  nacimiento.setHours(0, 0, 0, 0);
  if (anio < 1 || nacimiento.getFullYear() !== anio || nacimiento.getMonth() !== mes - 1 || nacimiento.getDate() !== dia) return null;
  const actual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (nacimiento > actual) return null;
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad--;
  return edad;
}

function reglasContrasena(valor) {
  return {
    longitud: valor.length >= 8,
    mayuscula: /\p{Lu}/u.test(valor),
    minuscula: /\p{Ll}/u.test(valor),
    numero: /[0-9]/.test(valor)
  };
}

// Valida formato de teléfono, sin comprobar su existencia o titularidad.
function telefonoValido(valor) {
  return /^\+?[0-9 ()-]+$/.test(valor) && /^[0-9]{7,15}$/.test(valor.replace(/[ ()+-]/g, ''));
}

const form = document.querySelector('#formulario-registro');
const usuario = document.querySelector('#usuario');
const contacto = document.querySelector('#contacto');
const nacimiento = document.querySelector('#nacimiento');
const contrasena = document.querySelector('#contrasena');
const confirmacion = document.querySelector('#confirmacion');
const estado = document.querySelector('#estado');
const mostrar = document.querySelector('#mostrar-contrasena');

const hoy = new Date();
nacimiento.max = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
document.querySelector('#ayuda-edad').textContent = `Debes tener al menos ${EDAD_MINIMA} años para registrarte.`;
document.querySelector('#anio').textContent = hoy.getFullYear();

document.querySelectorAll('[name="tipo-contacto"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const telefono = radio.value === 'tel';
    contacto.type = radio.value;
    contacto.autocomplete = radio.value;
    contacto.placeholder = telefono ? 'Ejemplo: +593 99 123 4567' : 'tu@correo.com';
    contacto.value = '';
    contacto.setCustomValidity('');
    document.querySelector('#etiqueta-contacto').textContent = telefono ? 'Número telefónico' : 'Correo electrónico';
    document.querySelector('#ayuda-contacto').textContent = telefono ? 'De 7 a 15 dígitos. Puedes incluir +, espacios, paréntesis y guiones.' : 'Introduce un correo con formato válido.';
    estado.textContent = '';
  });
});

function validar() {
  usuario.setCustomValidity(usuario.value && !/^[A-Za-z0-9_.]{3,30}$/.test(usuario.value) ? 'Usa de 3 a 30 caracteres: letras sin tildes, números, puntos o guiones bajos.' : '');
  contacto.setCustomValidity(contacto.type === 'tel' && contacto.value && !telefonoValido(contacto.value) ? 'Introduce un teléfono de 7 a 15 dígitos con formato válido.' : '');
  const edad = calcularEdad(nacimiento.value);
  nacimiento.setCustomValidity(nacimiento.value && (edad === null || edad < EDAD_MINIMA) ? `Introduce una fecha válida. Debes tener al menos ${EDAD_MINIMA} años.` : '');
  const reglas = reglasContrasena(contrasena.value);
  const etiquetas = { longitud: 'Al menos 8 caracteres', mayuscula: 'Una letra mayúscula', minuscula: 'Una letra minúscula', numero: 'Un número' };
  Object.entries(reglas).forEach(([clave, cumple]) => {
    const elemento = document.querySelector(`#regla-${clave}`);
    elemento.textContent = `${cumple ? '✓' : '○'} ${etiquetas[clave]}`;
    elemento.classList.toggle('cumplida', cumple);
  });
  contrasena.setCustomValidity(contrasena.value && !Object.values(reglas).every(Boolean) ? 'La contraseña debe cumplir los cuatro requisitos indicados.' : '');
  confirmacion.setCustomValidity(confirmacion.value && confirmacion.value !== contrasena.value ? 'Las contraseñas no coinciden.' : '');
}

form.addEventListener('input', () => { estado.textContent = ''; validar(); });
mostrar.addEventListener('click', () => {
  const visible = contrasena.type === 'password';
  contrasena.type = visible ? 'text' : 'password';
  mostrar.textContent = visible ? 'Ocultar' : 'Mostrar';
  mostrar.setAttribute('aria-pressed', String(visible));
});
form.addEventListener('submit', evento => {
  evento.preventDefault();
  validar();
  if (!form.reportValidity()) return;
  estado.textContent = 'Datos válidos. Esta demostración no ha creado una cuenta: falta conectar el registro con Flask y MySQL.';
});
validar();
