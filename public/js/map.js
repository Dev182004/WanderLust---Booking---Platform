function initMap(coordinates, title, location) {
  let lat, lon, zoom;

  if (!coordinates || coordinates.length !== 2) {
    console.warn("No valid coordinates for this listing. Falling back to Delhi.");
    lat = 28.6139;  
    lon = 77.2090;  
    zoom = 10;
  } else {
    lon = coordinates[0];
    lat = coordinates[1];
    zoom = 10;
  }

  const map = L.map('map').setView([lat, lon], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  
  L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${title}</b><br>${location || "Fallback: Delhi"}`)
    .openPopup();
}
