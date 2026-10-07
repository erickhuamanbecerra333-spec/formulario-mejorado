// ============================================================
// URL DE TU GOOGLE APPS SCRIPT
// ============================================================
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbyBAXBRjqUEDfdWFsBSRVk9uGdi0nZqPVGMUDp3z-3aW_Gx82B8xxqesQ-JEh0F2a_MAw/exec";


// ============================================================
// SECCIÓN 1: CARGAR LAS CARRERAS EN EL MENÚ <select>
// ============================================================
document.addEventListener("DOMContentLoaded", function() {
  const selectCarrera = document.getElementById("carrera");

  fetch(URL_GOOGLE)
    .then(response => response.json())
    .then(carreras => {
      selectCarrera.innerHTML = '<option value="">Seleccione un programa</option>';

      if (Array.isArray(carreras)) {
        carreras.forEach(carrera => {
          const option = document.createElement("option");
          option.value = carrera;
          option.textContent = carrera;
          selectCarrera.appendChild(option);
        });
      } else {
        console.error("Error: La respuesta no es una lista", carreras);
      }
    })
    .catch(error => {
      console.error("Error al conectar con Google Sheets:", error);
      selectCarrera.innerHTML = '<option value="">Error de conexión</option>';
    });


  // ============================================================
  // SECCIÓN 2: CARGAR LAS TARJETAS DE "NUESTROS PROGRAMAS"
  // 🔥 Usa las imágenes que vienen desde Google Sheets
  // ============================================================
  const contenedorProgramas = document.getElementById("contenedor-programas");

  fetch(URL_GOOGLE + "?tipo=programas")
    .then(response => response.json())
    .then(programas => {
      contenedorProgramas.innerHTML = "";

      if (Array.isArray(programas)) {
        programas.forEach(programa => {
          const card = document.createElement("div");
          card.className = "program-card";
          card.innerHTML = `
            <img src="${programa.imagen}" alt="${programa.carrera}" onerror="this.src='img/mi-logo.png'">
            <div class="program-info">
              <h3>${programa.carrera}</h3>
              <p>${programa.descripcion}</p>
              <a href="#" class="btn btn-blue-small">Más información</a>
            </div>
          `;
          contenedorProgramas.appendChild(card);
        });
      } else {
        console.error("Error: La respuesta no es una lista de programas", programas);
      }
    })
    .catch(error => {
      console.error("Error al cargar los programas:", error);
    });
});


// ============================================================
// SECCIÓN 3: ENVIAR LOS DATOS AL HACER CLIC EN "ENVIAR REGISTRO"
// ============================================================
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    carrera: document.getElementById("carrera").value,
    acepto: document.getElementById("acepto").checked
  };

  mensaje.textContent = "Enviando registro...";
  mensaje.style.color = "blue";

  fetch(URL_GOOGLE, {
    method: "POST",
    body: JSON.stringify(datos)
  })
  .then(response => {
    mensaje.textContent = "¡Registro enviado correctamente!";
    mensaje.style.color = "green";
    formulario.reset();
  })
  .catch(error => {
    console.error("Error:", error);
    mensaje.textContent = "Error al enviar. Revisa la consola.";
    mensaje.style.color = "red";
  });
});