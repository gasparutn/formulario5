// --- CONSTANTES GLOBALES ---
const SPREADSHEET_ID = '1Ru-XGng2hYJbUvl-H2IA7aYQx7Ju-jk1LT1fkYOnG0w';
/* */
const NOMBRE_HOJA_BUSQUEDA = 'Base de Datos';
const NOMBRE_HOJA_REGISTRO = 'Registros';
const NOMBRE_HOJA_CONFIG = 'Config';








/* */
const FOLDER_ID_FOTOS = '1S2SbkuYdvcLFZYoHacfgwEU80kAN094l';
const FOLDER_ID_FICHAS = '1aDsTTDWHiDFUeZ8ByGp8_LY3fdzVQomu';
const FOLDER_ID_COMPROBANTES = '169EISq4RsDetQ0H3B17ViZFfe25xPcMM'; // (Q4) Carpeta de mi respuesta anterior








const COL_HABILITADO_BUSQUEDA = 2; // 🛑 NUEVA Col B ("Habilitación")
const COL_NOMBRE_APELLIDO_BUSQUEDA = 3; // Col C (antes 2)
const COL_FECHA_NACIMIENTO_BUSQUEDA = 4; // Col D (antes 3)
// Col E (Descripción) se salta
const COL_DNI_BUSQUEDA = 6; // Col F (antes 5)
const COL_OBRASOCIAL_BUSQUEDA = 7; // Col G (antes 6)
const COL_COLEGIO_BUSQUEDA = 8; // Col H (antes 7)
const COL_RESPONSABLE_BUSQUEDA = 9; // Col I (antes 8)
const COL_TELEFONO_BUSQUEDA = 10; // Col J (antes 9)








// =========================================================
// (¡¡¡CONSTANTES ACTUALIZADAS!!!) - 36 columnas total
// (Se eliminaron las columnas AK, AL, AM)
// =========================================================
const COL_NUMERO_TURNO = 1;       // A
const COL_MARCA_TEMPORAL = 2;     // B
const COL_MARCA_N_E_A = 3;        // C
const COL_ESTADO_NUEVO_ANT = 4;   // D
const COL_EMAIL = 5;              // E
const COL_APELLIDO_NOMBRE = 6;    // F
const COL_FECHA_NACIMIENTO_REGISTRO = 7; // G
const COL_EDAD_ACTUAL = 8;        // H
const COL_DNI_INSCRIPTO = 9;      // I
const COL_OBRA_SOCIAL = 10;       // J
const COL_COLEGIO_JARDIN = 11;    // K
const COL_ADULTO_RESPONSABLE_1 = 12;// L
const COL_ADULTO_RESPONSABLE_2 = 13;// M
const COL_TELEFONO_CONTACTO = 14; // N
const COL_PERSONAS_AUTORIZADAS = 15;// O
const COL_PRACTICA_DEPORTE = 16;  // P
const COL_ESPECIFIQUE_DEPORTE = 17; // Q
const COL_TIENE_ENFERMEDAD = 18;  // R
const COL_ESPECIFIQUE_ENFERMEDAD = 19; // S
const COL_ES_ALERGICO = 20;       // T
const COL_ESPECIFIQUE_ALERGIA = 21; // U
const COL_APTITUD_FISICA = 22;    // V
const COL_FOTO_CARNET = 23;       // W
const COL_JORNADA = 24;           // X
const COL_METODO_PAGO = 25;       // Y
// --- Cuotas ---
const COL_CUOTA_1 = 26;           // Z
const COL_CUOTA_2 = 27;           // AA
const COL_CUOTA_3 = 28;           // AB
const COL_CANTIDAD_CUOTAS = 29;   // AC
// --- Pagos ---
const COL_ESTADO_PAGO = 30;       // AD
const COL_ID_PAGO_MP = 31;        // AE
const COL_PAGADOR_NOMBRE = 32;    // AF
const COL_PAGADOR_DNI = 33;       // AG
const COL_COMPROBANTE_MP = 34;    // AH
const COL_COMPROBANTE_MANUAL = 35;// AI
const COL_ENVIAR_EMAIL_MANUAL = 36;// AJ
// =========================================================
















// =========================================================
// (¡¡¡FUNCIÓN doGet CORREGIDA!!!)
// (M) Esta corrección evita la pantalla en blanco al requerir un click del usuario.
// =========================================================
function doGet(e) {
  try {
    const params = e.parameter;
    Logger.log("doGet INICIADO. Parámetros de URL: " + JSON.stringify(params));
    let paymentId = null;








    if (params) {
      if (params.payment_id) {
        paymentId = params.payment_id;
      } else if (params.data && typeof params.data === 'string' && params.data.startsWith('{')) {
        try {
          const dataObj = JSON.parse(params.data);
          if (dataObj.id) paymentId = dataObj.id;
        } catch (jsonErr) {
          Logger.log("No se pudo parsear e.parameter.data: " + params.data);
        }
      } else if (params.topic && params.topic === 'payment' && params.id) {
        paymentId = params.id;
      }
    }








    const appUrl = ScriptApp.getService().getUrl();








    // --- (¡¡¡NUEVA LÓGICA DE REDIRECCIÓN!!!) ---
    if (paymentId) {
      // 1. SI HAY UN ID DE PAGO, PROCESARLO
      Logger.log("doGet detectó regreso de MP. Procesando Payment ID: " + paymentId);
      procesarNotificacionDePago(paymentId); // Vive en Pagos.gs


      // 2. MOSTRAR PÁGINA DE ÉXITO CON BOTÓN (Redirección manual)
      Logger.log("Mostrando página de éxito para redirección MANUAL: " + appUrl);
      const html = `
        <html>
          <head>
            <title>Pago Completo</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 90vh; flex-direction: column; text-align: center; background-color: #f4f4f4; }
              .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
              .btn { display: inline-block; padding: 15px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 1.2em; margin-top: 20px; transition: background-color 0.3s; }
              .btn:hover { background-color: #218838; }
              h2 { color: #28a745; }
              p { font-size: 1.1em; color: #333; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>¡Pago Procesado Exitosamente!</h2>
              <p>Gracias por completar el pago. Presione el botón para volver al formulario.</p>
              <a href="${appUrl}" target="_top" class="btn">Volver al Formulario</a>
            </div>
          </body>
        </html>`;


      return HtmlService.createHtmlOutput(html)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);








    } else {
      // 3. SI NO HAY ID DE PAGO, SERVIR EL FORMULARIO
      const htmlTemplate = HtmlService.createTemplateFromFile('Index');
      htmlTemplate.appUrl = appUrl;
      const html = htmlTemplate.evaluate()
        .setTitle("Formulario de Registro")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      return html;
    }
    // --- (FIN DE LA NUEVA LÓGICA) ---








  } catch (err) {
    Logger.log("Error en la detección de parámetros de doGet: " + err.toString());
    // Fallback por si todo falla
    return HtmlService.createHtmlOutput("<b>Ocurrió un error:</b> " + err.message);
  }
}
// =========================================================
// (FIN DE LA CORRECCIÓN de doGet)
// =========================================================
















/* */
function doPost(e) {
  let postData;
  try {
    Logger.log("doPost INICIADO. Contenido de 'e': " + JSON.stringify(e));
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log("Error: El objeto 'e' o 'e.postData.contents' está vacío.");
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Payload vacío" })).setMimeType(ContentService.MimeType.JSON);
    }
    postData = e.postData.contents;
    Logger.log("doPost: Datos recibidos (raw): " + postData);
    const notificacion = JSON.parse(postData);
    Logger.log("doPost: Datos parseados (JSON): " + JSON.stringify(notificacion));








    if (notificacion.type === 'payment') {
      const paymentId = notificacion.data.id;
      if (paymentId) {
        Logger.log("Procesando ID de pago (desde doPost): " + paymentId);
        procesarNotificacionDePago(paymentId); // Vive en Pagos.gs
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ "status": "ok" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error grave en doPost (Webhook): " + error.toString());
    Logger.log("Datos (raw) que causaron el error: " + postData);
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
















/**
* (M) Guarda los datos finales en la hoja "Registros" (36 COLUMNAS)
*/
/* */
function registrarDatos(datos) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(60000);








    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let estadoActual = obtenerEstadoRegistro();




    if (estadoActual.cierreManual) return { status: 'CERRADO', message: 'El registro se encuentra cerrado.' };
    if (estadoActual.alcanzado) return { status: 'LIMITE_ALCANZADO', message: 'Se ha alcanzado el cupo máximo.' };
    if (datos.jornada === 'Jornada Normal extendida' && estadoActual.jornadaExtendidaAlcanzada) {
      return { status: 'LIMITE_EXTENDIDA', message: 'Se agotó el cupo para Jornada Extendida.' };
    }


    const dniBuscado = limpiarDNI(datos.dni);


    let hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
    if (!hojaRegistro) {
      hojaRegistro = ss.insertSheet(NOMBRE_HOJA_REGISTRO);


     // --- (¡¡¡ENCABEZADOS ACTUALIZADOS!!!) ---
      hojaRegistro.appendRow([
        'N° de Turno', 'Marca temporal', 'Marca N/E',
        'Estado', // (D)
        'Email', 'Apellido y Nombre', 'Fecha de Nacimiento', 'Edad Actual',
        'DNI', 'Obra Social', 'Colegio/Jardin',
        'Responsable 1', 'Responsable 2',
        'Teléfonos',
        'Autorizados',
        'Deporte', 'Especifique Deporte', 'Enfermedad', 'Especifique Enfermedad', 'Alergia', 'Especifique Alergia',
        'Aptitud Física (Link)', // V
        'Foto Carnet (Link)', // W
        'Jornada', // X
        'Método de Pago', // Y
        'Cuota 1', 'Cuota 2', 'Cuota 3', // Z, AA, AB
        'Cantidad Cuotas', // (AC)
        'Estado de Pago', // (AD)
        'ID Pago MP', 'Nombre Pagador', 'DNI Pagador',
        'Comprobante MP',
        'Comprobante Manual',
        'Enviar Email?' // (AJ)
        // (M) Columnas AK, AL, AM eliminadas
      ]);
    }








    // (c) Corrección N° Turno
    const nuevoNumeroDeTurno = hojaRegistro.getLastRow();








    const edadCalculada = calcularEdad(datos.fechaNacimiento);
    const edadFormateada = `${edadCalculada.anos}a, ${edadCalculada.meses}m, ${edadCalculada.dias}d`;
    const fechaObj = new Date(datos.fechaNacimiento);
    const fechaFormateada = Utilities.formatDate(fechaObj, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
    const marcaNE = (datos.jornada === 'Jornada Normal extendida' ? 'E' : 'N');








    // (e) Nueva columna Estado
    const estadoInscripto = (datos.tipoInscripto === 'nuevo') ? 'Nuevo' : 'Anterior';
















    // --- (¡¡¡FILA ACTUALIZADA!!!) ---
    hojaRegistro.appendRow([
      nuevoNumeroDeTurno,
      new Date(), marcaNE,
      estadoInscripto, // (D)
      datos.email, datos.apellidoNombre, fechaFormateada,
      edadFormateada, dniBuscado, datos.obraSocial, datos.colegioJardin,
      datos.adultoResponsable1 || '',
      datos.adultoResponsable2 || '',
      datos.telefonosContacto || '',
      datos.personasAutorizadas || '',
      datos.practicaDeporte, datos.especifiqueDeporte,
      datos.tieneEnfermedad, datos.especifiqueEnfermedad, datos.esAlergico, datos.especifiqueAlergia,
      datos.urlCertificadoAptitud || '',
      datos.urlFotoCarnet || '',
      datos.jornada,
      datos.metodoPago,
      '', '', '', // Cuota 1, 2, 3
      parseInt(datos.cantidadCuotas) || 0, // Cantidad de Cuotas
      datos.estadoPago, // Estado de Pago
      '', '', '', '', '', // IDs de Pago
      false // Checkbox (AJ)
      // (M) Columnas AK, AL, AM eliminadas
    ]);








    const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    hojaRegistro.getRange(nuevoNumeroDeTurno + 1, COL_ENVIAR_EMAIL_MANUAL).setDataValidation(rule);




    SpreadsheetApp.flush();






    obtenerEstadoRegistro(); // Actualiza el contador de cupos


    return { status: 'OK_REGISTRO', message: '¡Registro Exitoso!', numeroDeTurno: nuevoNumeroDeTurno, datos: datos };




  } catch (e) {
    Logger.log("ERROR CRÍTICO EN REGISTRO: " + e.toString());
    return { status: 'ERROR', message: 'Fallo al registrar los datos: ' + e.message };
  } finally {
    lock.releaseLock();
  }
}
















// --- FUNCIONES DE AYUDA (Helpers) ---








/* */
function uploadFileToDrive(data, mimeType, filename, dni, tipoArchivo) {
  try {
    if (!dni) return { status: 'ERROR', message: 'No se recibió DNI.' };
    let parentFolderId;
    switch (tipoArchivo) {
      case 'foto': parentFolderId = FOLDER_ID_FOTOS; break;
      case 'ficha': parentFolderId = FOLDER_ID_FICHAS; break; // 'ficha' es para Aptitud Física
      case 'comprobante': parentFolderId = FOLDER_ID_COMPROBANTES; break;
      default: return { status: 'ERROR', message: 'Tipo de archivo no reconocido.' };
    }
    if (!parentFolderId || parentFolderId.includes('AQUI_VA_EL_ID')) {
      return { status: 'ERROR', message: 'IDs de carpetas no configurados.' };
    }








    const parentFolder = DriveApp.getFolderById(parentFolderId);
    let subFolder;
    const folders = parentFolder.getFoldersByName(dni);
    subFolder = folders.hasNext() ? folders.next() : parentFolder.createFolder(dni);








    const decodedData = Utilities.base64Decode(data.split(',')[1]);
    const blob = Utilities.newBlob(decodedData, mimeType, filename);
    const file = subFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();








  } catch (e) {
    Logger.log('Error en uploadFileToDrive: ' + e.toString());
    return { status: 'ERROR', message: 'Error al subir archivo: ' + e.message };
  }
}








/* */
function limpiarDNI(dni) {
  if (!dni) return '';
  return String(dni).replace(/[.\s-]/g, '').trim();
}








/* */
function calcularEdad(fechaNacimientoStr) {
  if (!fechaNacimientoStr) return { anos: 0, meses: 0, dias: 0 };
  const fechaNacimiento = new Date(fechaNacimientoStr);
  const hoy = new Date();
  fechaNacimiento.setMinutes(fechaNacimiento.getMinutes() + fechaNacimiento.getTimezoneOffset());
  let anos = hoy.getFullYear() - fechaNacimiento.getFullYear();
  let meses = hoy.getMonth() - fechaNacimiento.getMonth();
  let dias = hoy.getDate() - fechaNacimiento.getDate();
  if (dias < 0) {
    meses--;
    dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  return { anos, meses, dias };
}








/**
* Verifica el estado de los cupos y el cierre manual.
* (Q8, Q11) Esta función es la clave para la seguridad de cupos.
*/
function obtenerEstadoRegistro() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);
    const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
    if (!hojaConfig) throw new Error(`Hoja "${NOMBRE_HOJA_CONFIG}" no encontrada.`);


    const limiteCupos = parseInt(hojaConfig.getRange('B1').getValue()) || 100;
    // 🛑 CORRECCIÓN: Leer el límite de B4 (LIMITE GUARDA)
    const limiteJornadaExtendida = parseInt(hojaConfig.getRange('B4').getValue());
    const formularioAbierto = hojaConfig.getRange('B11').getValue() === true;


    let registrosActuales = 0;
    let registrosJornadaExtendida = 0;
    if (hojaRegistro && hojaRegistro.getLastRow() > 1) {
      registrosActuales = hojaRegistro.getLastRow() - 1;
      const data = hojaRegistro.getRange(2, COL_MARCA_N_E_A, registrosActuales, 1).getValues();
      registrosJornadaExtendida = data.filter(row => row[0] === 'E').length;
    }


    hojaConfig.getRange('B2').setValue(registrosActuales);
    // 🛑 CORRECCIÓN: Escribir el contador en B5 (CONTADOR)
    hojaConfig.getRange('B5').setValue(registrosJornadaExtendida);
    SpreadsheetApp.flush();


    return {
      alcanzado: registrosActuales >= limiteCupos,
      // 🛑 CORRECCIÓN: Compara el contador con el límite (B4)
      jornadaExtendidaAlcanzada: registrosJornadaExtendida >= limiteJornadaExtendida,
      cierreManual: !formularioAbierto
    };
  } catch (e) {
    Logger.log("Error en obtenerEstadoRegistro: " + e.message);
    return { cierreManual: true, message: "Error al leer config: " + e.message };
  }
}






function validarAcceso(dni, tipoInscripto) {
try {
const estado = obtenerEstadoRegistro();
if (estado.cierreManual) return { status: 'CERRADO', message: 'El formulario se encuentra cerrado por mantenimiento.' };
if (estado.alcanzado && tipoInscripto === 'nuevo') return { status: 'LIMITE_ALCANZADO', message: 'Se ha alcanzado el cupo máximo para nuevos registros.'
};




if (!dni) return { status: 'ERROR', message: 'El DNI no puede estar vacío.' };
const dniLimpio = limpiarDNI(dni);
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);


// 1. BUSCAR EN LA HOJA DE REGISTROS ACTUALES ("Registros") PRIMERO
const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (hojaRegistro && hojaRegistro.getLastRow() > 1) {
const rangoDniRegistro = hojaRegistro.getRange(2, COL_DNI_INSCRIPTO, hojaRegistro.getLastRow() - 1, 1);
const celdaRegistro = rangoDniRegistro.createTextFinder(dniLimpio).matchEntireCell(true).findNext();




if (celdaRegistro) {
// ¡ENCONTRADO! El DNI ya está en la planilla de este año. BLOQUEA EL REGISTRO
const filaRegistro = celdaRegistro.getRow();
const rangoFila = hojaRegistro.getRange(filaRegistro, 1, 1, hojaRegistro.getLastColumn()).getValues()[0];


const estadoPago = rangoFila[COL_ESTADO_PAGO - 1];
const metodoPago = rangoFila[COL_METODO_PAGO - 1];
const nombreRegistrado = rangoFila[COL_APELLIDO_NOMBRE - 1];




if (estadoPago === 'Pagado') {
// (a) CHEQUEO DE APTITUD FÍSICA
const aptitudFisica = rangoFila[COL_APTITUD_FISICA - 1];
const adeudaAptitud = !aptitudFisica;




return {
status: 'DUPLICADO_PAGADO',
message:  `✅ El DNI  ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO y la inscripción está PAGADA.`,
adeudaAptitud: adeudaAptitud
};
}




if (String(metodoPago).includes('Efectivo')) {
return {
status: 'DUPLICADO_PENDIENTE_EFECTIVO',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO. El pago en efectivo está PENDIENTE.
Por favor, acérquese a la administración.`
};
}




try {
const datosParaPago = {
dni: dniLimpio,
apellidoNombre: nombreRegistrado,
email: rangoFila[COL_EMAIL - 1],
metodoPago: metodoPago,
jornada: rangoFila[COL_JORNADA - 1]
};




let identificadorPago = null; // null para Pago Total, "C1" etc para cuotas


if (metodoPago === 'Pago en Cuotas') {
const cantidadCuotasRegistrada = parseInt(rangoFila[COL_CANTIDAD_CUOTAS - 1]) || 3;


for (let i = 1; i <= cantidadCuotasRegistrada; i++) {
let colCuota = i === 1 ? COL_CUOTA_1 : (i === 2 ? COL_CUOTA_2 : COL_CUOTA_3);
let cuota_status = rangoFila[colCuota - 1];


if (!cuota_status || (!cuota_status.toString().includes("Pagada") && !cuota_status.toString().includes("Notificada"))) {
identificadorPago = `C${i}`; // "C1", "C2" o "C3"
break;
}
}




if (identificadorPago == null) {
// No hay cuotas pendientes
const aptitudFisica = rangoFila[COL_APTITUD_FISICA - 1];
const adeudaAptitud = !aptitudFisica;
return {
status: 'DUPLICADO_PAGADO',
message:  `✅ El DNI  ${dniLimpio} (${nombreRegistrado}) ya completó todas las cuotas.`,
adeudaAptitud: adeudaAptitud
};
}
}


// Llamar a crearPreferenciaDePago (que ahora devuelve un string de link o string de error)
const init_point = crearPreferenciaDePago(datosParaPago, identificadorPago, rangoFila[COL_CANTIDAD_CUOTAS - 1]); // Vive en Pagos.gs




// Verificar si la creación del link falló (p.ej. bloqueo de repago)
if (!init_point || !init_point.toString().startsWith('http')) {
Logger.log(`Bloqueo de repago detectado por validarAcceso: ${init_point}`);
return {
status: 'DUPLICADO_PENDIENTE_ERROR',
message: `⚠️ Error al generar link: ${init_point}`
};
}


// Si es un link http válido, continuar
return {
status: 'DUPLICADO_PENDIENTE_PAGO',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO.
Se generó un link para la próxima cuota pendiente (${identificadorPago || 'Pago Total'}).`,
init_point: init_point // Devolver solo el link
};


} catch (e) {
Logger.log("Error al regenerar link de pago en validarAcceso: " + e.message);
return {
status: 'DUPLICADO_PENDIENTE_ERROR',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO.
El pago está PENDIENTE, pero hubo un error al generar el link de pago: ${e.message}`
};
}
}
}
// --- FIN DE LA BÚSQUEDA EN "Registros" ---




// 2. (b) VALIDACIÓN ESTRICTA: CRUZAR "tipoInscripto" CON "Base de Datos"
const hojaBusqueda = ss.getSheetByName(NOMBRE_HOJA_BUSQUEDA);
if (!hojaBusqueda) return { status: 'ERROR', message: `La hoja "${NOMBRE_HOJA_BUSQUEDA}" no fue encontrada.` };




const rangoDNI = hojaBusqueda.getRange(2, COL_DNI_BUSQUEDA, hojaBusqueda.getLastRow() - 1, 1);
const celdaEncontrada = rangoDNI.createTextFinder(dniLimpio).matchEntireCell(true).findNext();




if (celdaEncontrada) {
// DNI SÍ EXISTE en Base de Datos
if (tipoInscripto === 'nuevo') {
// ERROR: Es "anterior" pero seleccionó "nuevo"
return { status: 'ERROR_TIPO_NUEVO', message: "El DNI se encuentra en la base datos, cambie 'SOY INSCRIPTO ANTERIOR' y valide nuevamente" };
}


// Es "anterior" y seleccionó "anterior" -> OK
const rowIndex = celdaEncontrada.getRow();


// 🛑 --- INICIO DE LA NUEVA VALIDACIÓN (Habilitación) --- 🛑
// 1. Leemos la fila COMPLETA (o al menos desde la Col B)
// El rango (Col B=2 a Col J=10) necesita 9 columnas.
const fila = hojaBusqueda.getRange(rowIndex, COL_HABILITADO_BUSQUEDA, 1, 9).getValues()[0];


// 2. Verificamos la Col B (índice 0 del array 'fila')
const habilitado = fila[0]; // fila[0] es la COL_HABILITADO_BUSQUEDA


if (habilitado !== true) {
// Si la casilla no está tildada (es FALSE o está vacía)
return {
status: 'NO_HABILITADO',
message: 'El dni se encuentra en la base de datos, pero no esta habilitado para la inscripción, consulte con la organización:'
};
}
// 🛑 --- FIN DE LA NUEVA VALIDACIÓN --- 🛑


// 3. Si está habilitado, extraemos los datos (con los nuevos índices)
const nombreCompleto = fila[1]; // Col C (índice 1)
const fechaNacimientoRaw = fila[2]; // Col D (índice 2)
const obraSocial = String(fila[5] || '').trim(); // Col G (índice 5)
const colegioJardin = String(fila[6] || '').trim(); // Col H (índice 6)
const responsable = String(fila[7] || '').trim(); // Col I (índice 7)
const telefono = String(fila[8] || '').trim(); // Col J (índice 8)


const fechaNacimientoStr = (fechaNacimientoRaw instanceof Date) ? Utilities.formatDate(fechaNacimientoRaw, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd') : (fechaNacimientoRaw ? new Date(fechaNacimientoRaw).toISOString().split('T')[0] : '');


return {
status: 'OK',
datos: { nombreCompleto, dni: dniLimpio, fechaNacimiento: fechaNacimientoStr, obraSocial, colegioJardin, adultoResponsable: responsable, telefonoContacto: telefono },
edad: calcularEdad(fechaNacimientoStr),
jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
tipoInscripto: tipoInscripto // (e) Pasa el tipo
};




} else {
// DNI NO EXISTE en Base de Datos
if (tipoInscripto === 'anterior') {
// ERROR: Es "nuevo" pero seleccionó "anterior"
return { status: 'ERROR_TIPO_ANT', message: "No se encuentra en la base de datos, por favor seleccione 'SOY NUEVO INSCRIPTO'" };
}




// Es "nuevo" y seleccionó "nuevo" -> OK
return {
status: 'OK_NUEVO',
message:  '✅ DNI validado. Proceda al registro.' ,
jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
tipoInscripto: tipoInscripto, // (e) Pasa el tipo
datos: { dni: dniLimpio }
};
}




} catch (e) {
Logger.log("Error en validarAcceso: " + e.message);
return { status: 'ERROR', message: 'Ocurrió un error al validar el DNI. ' + e.message };
}
}










/**
* (M) FUNCIÓN DE EMAIL (SIMPLIFICADA)
* Vuelve a recibir links como strings
*/
/* */
function enviarEmailConfirmacion(datos, numeroDeTurno, init_point = null, overrideMetodo = null) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);








    if (!hojaConfig || !datos.email || hojaConfig.getRange('B8').getValue() !== true) {
      Logger.log("Envío de email deshabilitado o sin email.");
      return;
    }








    let asunto = "";
    let cuerpoOriginal = "";
    let cuerpoFinal = "";








    const metodo = overrideMetodo || datos.metodoPago;








    if (metodo === 'Pago Online') {
      asunto = hojaConfig.getRange('E2:G2').getValue();
      cuerpoOriginal = hojaConfig.getRange('D4:H8').getValue();
      if (!asunto) asunto = "Confirmación de Registro (Pago Total)";
      if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nLink de Pago: {{linkDePago}}";








      cuerpoFinal = cuerpoOriginal
        .replace(/{{nombreCompleto}}/g, datos.apellidoNombre)
        .replace(/{{numeroDeTurno}}/g, numeroDeTurno)
        .replace(/{{linkDePago}}/g, init_point || 'N/A'); // init_point es un string (URL)








    } else if (metodo === 'Pago Efectivo' || metodo === 'registro_sin_pago') {
      asunto = hojaConfig.getRange('E13:H13').getValue();
      cuerpoOriginal = hojaConfig.getRange('D15:H19').getValue();
      if (!asunto) asunto = "Confirmación de Registro (Pago Efectivo)";
      if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nPor favor, acérquese a la administración.";








      cuerpoFinal = cuerpoOriginal
        .replace(/{{nombreCompleto}}/g, datos.apellidoNombre)
        .replace(/{{numeroDeTurno}}/g, numeroDeTurno);








    } else if (metodo === 'Pago en Cuotas') {
      asunto = hojaConfig.getRange('E24:G24').getValue();
      cuerpoOriginal = hojaConfig.getRange('D26:H30').getValue();
      if (!asunto) asunto = "Confirmación de Registro (Cuotas)";
      if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nLink Cuota 1: {{linkCuota1}}\nLink Cuota 2: {{linkCuota2}}\nLink Cuota 3: {{linkCuota3}}";








      // (M) init_point es ahora un objeto {link1, link2, link3} de strings (URLs)
      cuerpoFinal = cuerpoOriginal
        .replace(/{{nombreCompleto}}/g, datos.apellidoNombre)
        .replace(/{{numeroDeTurno}}/g, numeroDeTurno)
        .replace(/{{linkCuota1}}/g, init_point.link1 || 'Error al generar')
        .replace(/{{linkCuota2}}/g, init_point.link2 || 'Error al generar')
        .replace(/{{linkCuota3}}/g, init_point.link3 || 'Error al generar');








    } else {
      Logger.log(`Método de pago "${datos.metodoPago}" no reconocido para email.`);
      return;
    }








    MailApp.sendEmail({
      to: datos.email,
      subject: `${asunto} (Turno #${numeroDeTurno})`,
      body: cuerpoFinal
    });








    Logger.log(`Correo enviado a ${datos.email} por ${datos.metodoPago}.`);








  } catch (e) {
    Logger.log("Error al enviar correo (enviarEmailConfirmacion): " + e.message);
  }
}
















/**
* Sube un comprobante manual desde la pantalla de validación.
*/
function subirComprobanteManual(dni, fileData) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const dniLimpio = limpiarDNI(dni);
    if (!dniLimpio || !fileData) {
      return { status: 'ERROR', message: 'Faltan datos (DNI o archivo).' };
    }








    const fileUrl = uploadFileToDrive(fileData.data, fileData.mimeType, fileData.fileName, dniLimpio, 'comprobante');
    if (typeof fileUrl !== 'string' || !fileUrl.startsWith('http')) {
      throw new Error("Error al subir el archivo a Drive.");
    }








    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hoja = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
    if (!hoja) throw new Error(`La hoja "${NOMBRE_HOJA_REGISTRO}" no fue encontrada.`);








    const rangoDni = hoja.getRange(2, COL_DNI_INSCRIPTO, hoja.getLastRow() - 1, 1);
    const celdaEncontrada = rangoDni.createTextFinder(dniLimpio).matchEntireCell(true).findNext();








    if (celdaEncontrada) {
      const fila = celdaEncontrada.getRow();
      hoja.getRange(fila, COL_COMPROBANTE_MANUAL).setValue(fileUrl);
      hoja.getRange(fila, COL_ESTADO_PAGO).setValue("En revisión");








      Logger.log(`Comprobante manual subido para DNI ${dniLimpio} en fila ${fila}.`);
      return { status: 'OK', message: '¡Comprobante subido! Será revisado por la administración.' };
    } else {
      Logger.log(`No se encontró DNI ${dniLimpio} para subir comprobante manual.`);
      return { status: 'ERROR', message: `No se encontró el registro para el DNI ${dniLimpio}.` };
    }








  } catch (e) {
    Logger.log("Error en subirComprobanteManual: " + e.toString());
    return { status: 'ERROR', message: 'Error en el servidor: ' + e.message };
  } finally {
    lock.releaseLock();
  }
}








/**
* (a) Sube el certificado de aptitud física desde la pantalla de validación.
*/
function subirAptitudManual(dni, fileData) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const dniLimpio = limpiarDNI(dni);
    if (!dniLimpio || !fileData) {
      return { status: 'ERROR', message: 'Faltan datos (DNI o archivo).' };
    }








    const fileUrl = uploadFileToDrive(fileData.data, fileData.mimeType, fileData.fileName, dniLimpio, 'ficha');
    if (typeof fileUrl !== 'string' || !fileUrl.startsWith('http')) {
      throw new Error("Error al subir el archivo a Drive.");
    }








    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hoja = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
    if (!hoja) throw new Error(`La hoja "${NOMBRE_HOJA_REGISTRO}" no fue encontrada.`);








    const rangoDni = hoja.getRange(2, COL_DNI_INSCRIPTO, hoja.getLastRow() - 1, 1);
    const celdaEncontrada = rangoDni.createTextFinder(dniLimpio).matchEntireCell(true).findNext();








    if (celdaEncontrada) {
      const fila = celdaEncontrada.getRow();
      hoja.getRange(fila, COL_APTITUD_FISICA).setValue(fileUrl);








      Logger.log(`Aptitud Física subida para DNI ${dniLimpio} en fila ${fila}.`);
      return { status: 'OK', message: '¡Certificado de Aptitud subido con éxito!' };
    } else {
      Logger.log(`No se encontró DNI ${dniLimpio} para subir aptitud física.`);
      return { status: 'ERROR', message: `No se encontró el registro para el DNI ${dniLimpio}.` };
    }








  } catch (e) {
    Logger.log("Error en subirAptitudManual: " + e.toString());
    return { status: 'ERROR', message: 'Error en el servidor: ' + e.message };
  } finally {
    lock.releaseLock();
  }
}








/* */
function sincronizarRegistros() {
  Logger.log("sincronizarRegistros: Función omitida.");
  return;
}








/**
 * Sube un archivo individual de forma asíncrona desde el cliente.
 */
function subirArchivoIndividual(fileData, dni, tipoArchivo) {
  try {
    if (!fileData || !dni || !tipoArchivo) {
      return { status: 'ERROR', message: 'Faltan datos para la subida (DNI, archivo o tipo).' };
    }


    const dniLimpio = limpiarDNI(dni);


    const fileUrl = uploadFileToDrive(
      fileData.data,
      fileData.mimeType,
      fileData.fileName,
      dniLimpio,
      tipoArchivo
    );


    if (typeof fileUrl === 'object' && fileUrl.status === 'ERROR') {
      return fileUrl;
    }


    return { status: 'OK', url: fileUrl };








  } catch (e) {
    Logger.log("Error en subirArchivoIndividual: " + e.toString());
    return { status: 'ERROR', message: 'Error del servidor al subir: ' + e.message };
  }
}








