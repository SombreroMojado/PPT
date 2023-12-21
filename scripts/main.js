/* Nombre de los iconos
Piedra: <i class="fa-solid fa-hand-back-fist"></i>
Papel: <i class="fa-solid fa-hand"></i>
Tijera: <i class="fa-solid fa-hand-scissors"></i>
*/

// funcion incorporada para poder esperar un tiempo determinado
const delay = ms => new Promise(res => setTimeout(res, ms));

// crea y establece en 0 las puntuaciones
let puntosJugador = 0, puntosBot = 0;

// al cargar la página configura el estado a preparado
$(document).ready(actualizarEstado());

// establece el icono del jugador
// cambiando de clase la etiqueta del jugador cambia visualmente gracias a la libreria de iconos
function actualizarJugador(respuesta){
    switch (respuesta){
        case "piedra":
            $("#eleccion-jugador").attr("class", "fa-solid fa-hand-back-fist fa-flip-horizontal");
            return respuesta

        case "papel":
            $("#eleccion-jugador").attr("class", "fa-solid fa-hand fa-flip-horizontal");
            return respuesta

        case "tijera":
            $("#eleccion-jugador").attr("class", "fa-solid fa-hand-scissors fa-flip-horizontal");
            return respuesta

        case "nada":
            $("#eleccion-jugador").attr("class", "fa-solid fa-solid fa-question");
            return respuesta

        default:
            $("#eleccion-jugador").attr("class", "fa-solid fa-solid fa-question");
            return respuesta
            
    }
}


// establece el icono del oponente
function actualizarBot(respuesta){
    switch (respuesta){
        case "piedra":
            $("#eleccion-bot").attr("class", "fa-solid fa-hand-back-fist");
            return respuesta

        case "papel":
            $("#eleccion-bot").attr("class", "fa-solid fa-hand");
            return respuesta

        case "tijera":
            $("#eleccion-bot").attr("class", "fa-solid fa-hand-scissors");
            return respuesta

        default:
            $("#eleccion-bot").attr("class", "fa-solid fa-solid fa-question");
            return respuesta
    }
}

// elige de forma aleatoria el movimiento del oponente
function respuestaBot(){
    let x = Math.round(Math.random() * 2);
    switch (x){
        case 0:
            return("piedra")

        case 1:
            return("papel")

        case 2:
            return("tijera")
    }
}


// se ejecuta cada vez que se presiona el boton de jugar, hace la cuenta regresiva, toma la imagen de la camara, y da el resultado de la partida
async function play(){
    loop();
    await countdown();
    cam_on = 0;
    let prediccion = await predict();
    actualizarJugador(prediccion);
    actualizarEstado(resultadoPartida(prediccion, actualizarBot(respuestaBot())));
    cam_on = 1;

}

// compara la eleccion del jugador y el oponente y determina un ganador
function resultadoPartida(jugador, bot){
    if(jugador == bot){ return ("empate")}

    if(jugador == "piedra"){
        if(bot == "tijera"){return ("gana-jugador")}
        if(bot == "papel"){return ("gana-bot")}
    }

    if(jugador == "papel"){
        if(bot == "piedra"){return ("gana-jugador")}
        if(bot == "tijera"){return ("gana-bot")}
    }

    if(jugador == "tijera"){
        if(bot == "papel"){return ("gana-jugador")}
        if(bot == "piedra"){return ("gana-bot")}
    }
}


// muestra en el recuadro de abajo el estado de la partida (quien ha ganado o si todavía no se ha jugado)
function actualizarEstado(estado){
    if(!estado){
        let i1 = $("<i></i>").attr("class", "fa-solid fa-hourglass-start");
        let i2 = $("<i></i>").attr("class", "fa-solid fa-hourglass-end");
        let label = $("<label></label>").attr("id", "estado-text");

        $("#estado").empty();
        $("#estado").prepend(i1).append(label).append(i2);
        $("#estado-text").text("ESPERANDO...");
        return
    }

    if(estado == "gana-bot"){
        let i1 = $("<i></i>").attr("class", "fa-solid fa-robot");
        let i2 = $("<i></i>").attr("class", "fa-solid fa-robot");
        let label = $("<label></label>").attr("id", "estado-text");
        
        $("#estado").empty();
        $("#estado").prepend(i1).append(label).append(i2);
        $("#estado-text").text("HAS PERDIDO");
        sumarPuntos("bot", 1);
    }

    if(estado == "gana-jugador"){
        let i1 = $("<i></i>").attr("class", "fa-solid fa-trophy");
        let i2 = $("<i></i>").attr("class", "fa-solid fa-trophy");
        let label = $("<label></label>").attr("id", "estado-text");

        $("#estado").empty();
        $("#estado").prepend(i1).append(label).append(i2);
        $("#estado-text").text("HAS GANADO");
        sumarPuntos("jugador", 1);
    }

    if(estado == "empate"){
        let i1 = $("<i></i>").attr("class", "fa-solid fa-bars");
        let i2 = $("<i></i>").attr("class", "fa-solid fa-bars");
        let label = $("<label></label>").attr("id", "estado-text");

        $("#estado").empty();
        $("#estado").prepend(i1).append(label).append(i2);
        $("#estado-text").text("EMPATE");
    }

    estado = "";
}


// muestra la cuenta regresiva en el recuadro de abajo
async function countdown(){
    let i1 = $("<i></i>").attr("class", "fa-solid fa-1")
    let i2 = $("<i></i>").attr("class", "fa-solid fa-2")
    let i3 = $("<i></i>").attr("class", "fa-solid fa-3")
    let i4 = $("<i></i>").attr("class", "fa-solid fa-clapperboard")

    $("#estado").empty();
    $("#estado").append(i1);
    await delay(1000);

    $("#estado").empty();
    $("#estado").append(i2);
    await delay(1000);

    $("#estado").empty();
    $("#estado").append(i3);
    await delay(1000);
    
    $("#estado").empty();
    $("#estado").append(i4);
    await delay(500);
}



// añade la puntuacion al marcador
function sumarPuntos(participante, puntos){
    switch (participante){
        case "bot":
            puntosBot += puntos;
            break

        case "jugador":
            puntosJugador += puntos;
            break
    }

    $("#puntos-jugador").text(puntosJugador);
    $("#puntos-bot").text(puntosBot);
}