window.onload = function() {
  const bulgariaBounds = [[41.2, 22.4], [44.3, 28.6]];

  const map = L.map('map', {
    maxBounds: bulgariaBounds,
    maxBoundsViscosity: 1.0,

    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    touchZoom: false,

    minZoom: 7,
    maxZoom: 7
  }).fitBounds(bulgariaBounds);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  const cities = [
    { name: "Sofia", coords: [42.6977, 23.3219] },
    { name: "Plovdiv", coords: [42.1354, 24.7453] },
    { name: "Varna", coords: [43.2141, 27.9147] },
    { name: "Burgas", coords: [42.5048, 27.4626] },
    { name: "Ruse", coords: [43.8356, 25.9653] }
  ];

  const cityNameDiv = document.getElementById("city-name");

  cities.forEach(city => {
    L.marker(city.coords).addTo(map).on("click", () => {
      cityNameDiv.textContent = city.name;
    });
  });
};
