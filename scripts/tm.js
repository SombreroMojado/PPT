// El enlace a tu modelo proporcionado por el panel de exportación de Teachable Machine
// O en caso de descargarte el modelo la carpeta a el
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions, cam_on;

// Carga el modelo de imagen y configura la cámara web
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // carga el modelo y los metadatos
    // Consulta tmImage.loadFromFiles() en la API para admitir archivos desde un selector de archivos
    // o archivos desde tu disco duro local
    // Nota: la biblioteca de pose agrega el objeto "tmImage" a tu ventana (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Función de conveniencia para configurar una cámara web
    const flip = true; // si se debe voltear la cámara web
    webcam = new tmImage.Webcam(300, 300, flip); // ancho, alto, voltear
    await webcam.setup(); // solicitar acceso a la cámara web
    await webcam.play();
    window.requestAnimationFrame(loop);

    // agrega elementos al DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    document.getElementById("btn-cam").style.display = "none";
}

// se ejecuta por siempre, actualiza la cámara siempre que esté activa y reconoce al jugador
async function loop(){
    if(cam_on == 0) return;
    webcam.update();
    let prediccion = await predict();
    actualizarJugador(prediccion);
    window.requestAnimationFrame(loop)
}

// pasa la imagen de la cámara web a través del modelo de imagen
async function predict() {
    // la funcion predict puede tomar una imagen, video o elemento canvas html
    const prediction = await model.predict(webcam.canvas);
    // saca y devuelve el máximo de las predicciones
    for (let i = 0; i < maxPredictions; i++) {
        if(prediction[i].probability.toFixed(2) >= .5){
            let resultado = prediction[i].className;
            return (resultado)
        }
    }
}