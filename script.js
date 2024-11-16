let map;
let marker;

const IPINFO_TOKEN = `a87228d5c81c1c`
// Inicialización del mapa con coordenadas predeterminadas
function initMap() {
  map = L.map('map').setView([51.505, -0.09], 2);  // Coordenadas iniciales (mundo con zoom bajo)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  marker = L.marker([51.505, -0.09]).addTo(map);  // Marcador inicial
}

// Obtener la IP pública del visitante
function getLocationByIP() {
  // Obtener el valor del campo de texto (si está vacío, se usará la IP del visitante)
  const ipAddress = document.getElementById('ipAddress').value.trim() || 'auto';

  // URL de IPinfo.io para obtener información de la IP
  const ipUrl = ipAddress === 'auto'
    ? 'https://ipinfo.io/json?token=a87228d5c81c1c'  // Usar la IP del visitante si no se ingresa ninguna
    : `https://ipinfo.io/${ipAddress}/json?token=${IPINFO_TOKEN}`;  // Usar la IP ingresada

  fetch(ipUrl)
    .then(response => response.json())
    .then(data => {
      if (data.loc) {
        const loc = data.loc.split(',');
        const lat = parseFloat(loc[0]);
        const lon = parseFloat(loc[1]);

        // Actualizar el mapa con la ubicación obtenida
        const userLocation = [lat, lon];
        map.setView(userLocation, 10);  // Cambiar la vista del mapa al centro de la ubicación
        marker.setLatLng(userLocation);  // Mover el marcador a la ubicación
        map.setZoom(10);  // Ajustar el zoom para la ubicación

        // Mostrar información de la IP
        displayIPInfo(data);
      } else {
        alert('No se pudo obtener la ubicación para esta IP.');
      }
    })
    .catch(error => {
      console.error('Error al obtener la ubicación:', error);
      alert('Hubo un error al obtener la información de la IP.');
    });
}

// Función para mostrar la información de la IP
function displayIPInfo(data) {
  const info = `
    <strong>IP:</strong> ${data.ip} <br>
    <strong>Ciudad:</strong> ${data.city || 'No disponible'} <br>
    <strong>Región:</strong> ${data.region || 'No disponible'} <br>
    <strong>País:</strong> ${data.country || 'No disponible'} <br>
    <strong>Organización:</strong> ${data.org || 'No disponible'} <br>
  `;
  document.getElementById('ipInfo').innerHTML = info;
}

// Ejecutar la función para obtener la ubicación de la IP cuando la página cargue
window.onload = () => {
  initMap();  // Inicializar el mapa
  getLocationByIP();  // Obtener la ubicación de la IP del visitante por defecto
};
