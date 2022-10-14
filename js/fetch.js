//API KEY
const APIKEY = "068fe66ee2538f706da7cd9a5a918944";

//Elementos dentro de la seccion del buscador
const inputElement = document.getElementById("inputBusqueda");
const buttonSearch = document.getElementById("buscar");
const ciudadInvalida = document.getElementById("ciudadInvalida");
const metricas = document.getElementById("metricas");

//Elementos dentro de la seccion metricas
const nombreCiudad = document.getElementById("nombreCiudad");
const icono = document.getElementById("icono");
const temperatura = document.getElementById("temperatura");
const estadoTiempo = document.getElementById("estadoTiempo");
const sensacionTermica = document.getElementById("sensacionTermica");
const tempMinima = document.getElementById("tempMinima");
const tempMaxima = document.getElementById("tempMaxima");
const humedad = document.getElementById("humedad");
const presion = document.getElementById("presion");
const viento = document.getElementById("viento");
const maps = document.getElementById("maps");

//Evento para revisar si hay datos en el localStorage
addEventListener("DOMContentLoaded", () => {
  let dataBusqueda = localStorage.getItem("busqueda");
  if (dataBusqueda) {
    cargarDatos(JSON.parse(dataBusqueda));
  }
});

//Evento para buscar en caso de hacer click en el boton
buttonSearch.addEventListener("click", (e) => {
  e.preventDefault();

  Ejecucion();
});

//Evento para buscar cuando se aprieta la tecla enter
inputElement.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.code === "Enter") {
    Ejecucion();
  }
});

//Funcion con la lógica del programa
function Ejecucion() {
  ciudadInvalida.style.display = "none";
  metricas.style.display = "none";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputElement.value}&appid=${APIKEY}&units=metric&lang=es`
  )
    .then((resp) => {
      //Retorno la respuesta como JSON
      return resp.json(); //
    })

    .then((data) => {
      console.log(`JSON crudo: `, data);

      if (data) {
        localStorage.setItem("busqueda", JSON.stringify(data));
        cargarDatos(data);
      }
    });
}

//Función que carga los datos
function cargarDatos(data) {
  if (data.cod == "400" || data.cod == "404") {
    
    //En caso de devolverme un error se muestra y se pide cargar nuevamente
    ciudadInvalida.style.display = "block";
  } else {
    
    //Cargo los innerHTML de los elementos con los datos que provee la API
    nombreCiudad.innerHTML = data.name + ", " + data.sys.country;

    icono.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    estadoTiempo.innerHTML = data.weather[0].description.toUpperCase();

    temperatura.innerHTML = Math.ceil(data.main.temp) + "°C";

    sensacionTermica.innerHTML = Math.ceil(data.main.feels_like) + "°C";

    tempMinima.innerHTML = Math.ceil(data.main.temp_min) + "°C";

    tempMaxima.innerHTML = Math.ceil(data.main.temp_max) + "°C";

    humedad.innerHTML = data.main.humidity;

    presion.innerHTML = data.main.pressure;

    viento.innerHTML = (data.wind.speed * 3.6).toFixed(2);

    crearMapa(data.name, data.sys.country);

    metricas.style.display = "initial";
  }
}

//Función cpara la carga y creacion del mapa
function crearMapa(name, country) {
  let iframe = document.createElement("iframe");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("width", "600");
  iframe.setAttribute("height", "600");
  iframe.setAttribute("src", `https://maps.google.com/maps?q=${name}, ${country}&t=&z=13&ie=UTF8&iwloc=&output=embed`);

  maps.innerHTML = "";
  maps.appendChild(iframe);
}