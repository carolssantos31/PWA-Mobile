// GEOLOCALIZAÇÃO
let watchId = null;
const geoStatus = document.getElementById("geoStatus");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const accEl = document.getElementById("acc");
const btnStartGeo = document.getElementById("btnStartGeo");
const btnStopGeo = document.getElementById("btnStopGeo");
const openMaps = document.getElementById("openMaps");

btnStartGeo.addEventListener("click", () => {
  if (!navigator.geolocation) {
    geoStatus.textContent = "Geolocalização não suportada.";
    return;
  }
  geoStatus.textContent = "Procurando posição...";
  watchId = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000,
  });
  btnStartGeo.disabled = true;
  btnStopGeo.disabled = false;
});
btnStopGeo.addEventListener("click", () => {
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  watchId = null;
  geoStatus.textContent = "Localização parada.";
  btnStartGeo.disabled = false;
  btnStopGeo.disabled = true;
});
function onGeoSuccess(pos) {
  const { latitude, longitude, accuracy } = pos.coords;
  latEl.textContent = latitude.toFixed(6);
  lngEl.textContent = longitude.toFixed(6);
  accEl.textContent = accuracy;
  geoStatus.textContent = "Posição atualizada.";
  openMaps.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
function onGeoError(err) {
  geoStatus.textContent = "Erro: " + err.message;
}

// DOG API
const btnFetchDog = document.getElementById("btnFetchDog");
const dogImg = document.getElementById("dogImg");
const breedSelect = document.getElementById("breedSelect");

btnFetchDog.addEventListener("click", async () => {
  btnFetchDog.disabled = true;
  btnFetchDog.textContent = "Buscando...";
  try {
    const breed = breedSelect.value;
    const url = breed
      ? `https://dog.ceo/api/breed/${breed}/images/random`
      : "https://dog.ceo/api/breeds/image/random";
    const res = await fetch(url);
    const data = await res.json();
    dogImg.src = data.message;
  } catch (e) {
    dogImg.alt = "Erro ao buscar imagem.";
  } finally {
    btnFetchDog.disabled = false;
    btnFetchDog.textContent = "Buscar cachorro";
  }
});

// CÂMERA
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const btnStartCam = document.getElementById("btnStartCam");
const btnCapture = document.getElementById("btnCapture");
const btnStopCam = document.getElementById("btnStopCam");
const lastImage = document.getElementById("lastImage");
const downloadLink = document.getElementById("downloadLink");
const fileInput = document.getElementById("fileInput");
let stream = null;

btnStartCam.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
    btnCapture.disabled = false;
    btnStopCam.disabled = false;
    btnStartCam.disabled = true;
  } catch (e) {
    alert("Não foi possível acessar a câmera: " + e.message);
  }
});
btnCapture.addEventListener("click", () => {
  const w = video.videoWidth || 320;
  const h = video.videoHeight || 240;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    lastImage.src = url;
    downloadLink.href = url;
  }, "image/png");
});
btnStopCam.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
  }
  btnCapture.disabled = true;
  btnStopCam.disabled = true;
  btnStartCam.disabled = false;
});
fileInput.addEventListener("change", (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  lastImage.src = url;
  downloadLink.href = url;
});
// FIM CÂMERA