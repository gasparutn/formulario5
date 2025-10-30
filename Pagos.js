/* */
// --- CONFIGURACIÓN DE MERCADO PAGO ---
/* */
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-7838602473992019-102318-99f752417a8ccd21a0d2eba48126da4d-2940898374'; // 🛑 Token V13
const MP_API_URL = 'https://api.mercadopago.com/checkout/preferences';


// =========================================================
// Las constantes (COL_EMAIL, COL_ESTADO_PAGO, etc.) se leen
// automáticamente desde el archivo 'codigo.gs'.
// =========================================================


/**
* (PASO 1)
*/
function paso1_registrarRegistro(datos) {
try {
if (!datos.urlFotoCarnet) {
Logger.log("Error: El formulario se envió sin la URL de la Foto Carnet.");
return { status: 'ERROR', message: 'Falta la Foto Carnet. Por favor, asegúrese de que el archivo se haya subido correctamente.'
};
}


if (datos.metodoPago === 'Pago Efectivo') {
datos.estadoPago = "Pendiente (Efectivo)";
} else if (datos.metodoPago === 'Pago en Cuotas') {
datos.estadoPago = `Pendiente (${datos.cantidadCuotas} Cuotas)`;
} else { // 'Pago Online'
datos.estadoPago = "Pendiente";
}


const respuestaRegistro = registrarDatos(datos); // registrarDatos() vive en codigo.gs


return respuestaRegistro;


} catch (e) {
Logger.log("Error en paso1_registrarRegistro: " + e.message);
return { status: 'ERROR', message: 'Error general en el servidor (Paso 1): ' + e.message };
}
}


/**
* (M) PASO 2 (SIMPLIFICADO)
* Ya no guarda Preference IDs.
*/
function paso2_crearPagoYEmail(datos, numeroDeTurno) {
try {
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);
const pagosHabilitados = hojaConfig.getRange('B23').getValue();


if (pagosHabilitados === false) {
Logger.log(`Pagos deshabilitados (Config B23). Registrando sin link!!`);
enviarEmailConfirmacion(datos, numeroDeTurno, null, 'registro_sin_pago');
return { status: 'OK_REGISTRO_SIN_PAGO', message: `¡Inscripción registrada!! Los pagos online están momentáneamente desactivados.\nPor favor, acérquese a la administración.` };
}


if (datos.metodoPago === 'Pago Efectivo') {
enviarEmailConfirmacion(datos, numeroDeTurno);
return { status: 'OK_EFECTIVO', message: '¡Registro exitoso! Por favor, acérquese a la administración para completar el pago.' };
}


if (datos.metodoPago === 'Pago Online') {
let init_point;
try {
init_point = crearPreferenciaDePago(datos, null); // Devuelve string (link o error)


// Si no es un link, es un error de repago
if (!init_point || !init_point.startsWith('http')) {
return { status: 'OK_REGISTRO_SIN_LINK', message: init_point };
}


} catch (e) {
Logger.log("Error al crear preferencia de pago (total): " + e.message);
return { status: 'OK_REGISTRO_SIN_LINK', message: `¡Tu registro se guardó!! Pero falló la creación del link de pago.\nPor favor, contacte a la administración para abonar.` };
}


if (datos.email && init_point) {
enviarEmailConfirmacion(datos, numeroDeTurno, init_point); // Enviar solo el link
}
return { status: 'OK_PAGO', init_point: init_point };
}


if (datos.metodoPago === 'Pago en Cuotas') {
const cantidadCuotas = parseInt(datos.cantidadCuotas);
const emailLinks = {}; // Objeto solo con links para el email


try {
for (let i = 1; i <= 3; i++) {
if (i <= cantidadCuotas) {
const link = crearPreferenciaDePago(datos, `C${i}`, cantidadCuotas);
emailLinks[`link${i}`] = link; // Guardar link o string de error
} else {
emailLinks[`link${i}`] = 'N/A (No aplica)';
}
}


} catch (e) {
Logger.log("Error al crear preferencias de pago (cuotas): " + e.message);
return { status: 'OK_REGISTRO_SIN_LINK', message: `¡Tu registro se guardó!! Pero falló la creación de los links de pago.\nPor favor, contacte a la administración.` };
}


if (datos.email) {
enviarEmailConfirmacion(datos, numeroDeTurno, emailLinks); // Enviar el objeto de links
}


const primerLink = emailLinks.link1;
// Verificar si el primer link es un link válido o un error de repago
if (!primerLink || !primerLink.startsWith('http')) {
return { status: 'OK_REGISTRO_SIN_LINK', message: `¡Registro guardado!! ${primerLink}` };
}
return { status: 'OK_PAGO', init_point: primerLink };
}


} catch (e) {
Logger.log("Error en paso2_crearPagoYEmail: " + e.message);
return { status: 'ERROR', message: 'Error general en el servidor (Paso 2): ' + e.message };
}
}


// =========================================================
// (M) crearPreferenciaDePago (SIMPLIFICADO)
// Ahora devuelve solo el string del init_point (o string de error).
// =========================================================
function crearPreferenciaDePago(datos, cuotaIdentificador = null, cantidadTotalCuotas = 0) {
try {
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);
const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
let precioInscripcion;
let tituloPago;
const dniLimpio = limpiarDNI(datos.dni);
let externalReference;


// --- LÓGICA DE BLOQUEO (No cambia) ---
if (hojaRegistro && hojaRegistro.getLastRow() > 1) {
const rangoDni = hojaRegistro.getRange(2, COL_DNI_INSCRIPTO, hojaRegistro.getLastRow() - 1, 1);
const celdaEncontrada = rangoDni.createTextFinder(dniLimpio).matchEntireCell(true).findNext();


if (celdaEncontrada) {
const fila = celdaEncontrada.getRow();


if (cuotaIdentificador) { // Es Pago en Cuotas
const cuotaIndex = parseInt(cuotaIdentificador.replace('C',''));
let colCuota;
if (cuotaIndex === 1) colCuota = COL_CUOTA_1;
else if (cuotaIndex === 2) colCuota = COL_CUOTA_2;
else if (cuotaIndex === 3) colCuota = COL_CUOTA_3;


if (colCuota) {
const estadoCuota = hojaRegistro.getRange(fila, colCuota).getValue();
const estadoCuotaStr = estadoCuota ? estadoCuota.toString() : '';


if (estadoCuotaStr.includes("Pagada") || estadoCuotaStr.includes("Notificada")) {
Logger.log(`Bloqueo: Cuota ${cuotaIndex} ya pagada/notificada para DNI ${dniLimpio}.`);
throw new Error(`La Cuota ${cuotaIndex} ya fue registrada como pagada.`);
}
}
} else { // Es 'Pago Online' (Total)
const estadoPagoGeneral = hojaRegistro.getRange(fila, COL_ESTADO_PAGO).getValue();
const estadoPagoStr = estadoPagoGeneral ? estadoPagoGeneral.toString() : '';


if (estadoPagoStr.includes("Pagado") || estadoPagoStr.includes("Notificada")) {
Logger.log(`Bloqueo: Pago Total ya realizado para DNI ${dniLimpio}.`);
throw new Error(`El pago total para este DNI ya fue registrado como pagado.`);
}
}
}
}
// --- (FIN DE LA LÓGICA DE BLOQUEO) ---


if (cuotaIdentificador) {
precioInscripcion = hojaConfig.getRange("B20").getValue();
tituloPago = `Inscripción Colonia 2025 - Cuota ${cuotaIdentificador.replace('C','')} de ${cantidadTotalCuotas}`;
externalReference = `${dniLimpio}-${cuotaIdentificador}`;
} else {
precioInscripcion = hojaConfig.getRange("B14").getValue();
tituloPago = "Inscripción Colonia 2025 - Total";
externalReference = dniLimpio;
}


if (!precioInscripcion || isNaN(parseFloat(precioInscripcion)) || precioInscripcion <= 0) {
throw new Error('No se pudo determinar el precio. Revise la Hoja Config (B14 o B20).');
}


const appUrl = ScriptApp.getService().getUrl();


const payload = {
items: [{
title: tituloPago,
description: `Inscripción para DNI ${datos.dni}`,
quantity: 1,
currency_id: 'ARS',
unit_price: parseFloat(precioInscripcion)
}],
payer: {
name: datos.apellidoNombre,
// email: datos.email // 🛑 ESTA ES LA MODIFICACIÓN SOLICITADA 🛑
},
external_reference: externalReference,
back_urls: {
  success: appUrl + '?status=success',
  pending: appUrl + '?status=pending',
  failure: appUrl + '?status=failure'
},
auto_return: 'approved'
};


const options = {
method: 'post',
contentType: 'application/json',
headers: { Authorization: 'Bearer ' + MERCADO_PAGO_ACCESS_TOKEN },
payload: JSON.stringify(payload),
muteHttpExceptions: true
};


const response = UrlFetchApp.fetch(MP_API_URL, options);
const data = JSON.parse(response.getContentText());


if (response.getResponseCode() >= 400) {
Logger.log("Error MP: " + response.getContentText());
throw new Error('Falló la creación del link de pago: ' + data.message);
}


// (M) Devolver solo el string del link
return data.init_point;


} catch (e) {
if (e.message && (e.message.startsWith("La Cuota") || e.message.startsWith("El pago total"))) {
Logger.log(`Bloqueo de Re-pago aplicado: ${e.message}`);
// (M) Devolver solo el string de error
return e.message;
}
Logger.log("Error en crearPreferenciaDePago: " + e.message);
throw e;
}
}
// =========================================================
// (FIN DE LA CORRECCIÓN)
// =========================================================


// === FUNCIONES DE WEBHOOK ===


/* */
function procesarNotificacionDePago(paymentId) {
const lock = LockService.getScriptLock();
if (!lock.tryLock(10000)) {
Logger.log("Procesamiento de pago " + paymentId + " ya en curso (lock).");
return;
}


try {
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hoja = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (hoja && hoja.getLastRow() > 1) {
const rangoIds = hoja.getRange(2, COL_ID_PAGO_MP, hoja.getLastRow() - 1, 1);
const finder = rangoIds.createTextFinder(String(paymentId).split(' ')[0]); // Busca ID sin timestamp
const celdaEncontrada = finder.findNext();


if (celdaEncontrada) {
Logger.log(`Payment ID ${paymentId} ya fue procesado (encontrado en Fila ${celdaEncontrada.getRow()}). Ignorando webhook duplicado.`);
lock.releaseLock();
return;
}
}


const url = "https://api.mercadopago.com/v1/payments/" + paymentId;
const options = {
'method': 'get',
'headers': { 'Authorization': 'Bearer ' + MERCADO_PAGO_ACCESS_TOKEN },
'muteHttpExceptions': true
};
const response = UrlFetchApp.fetch(url, options);
const detallesDelPago = JSON.parse(response.getContentText());


if (response.getResponseCode() !== 200) {
Logger.log("Fallo al obtener info del pago " + paymentId + ". Respuesta: " + response.getContentText());
return;
}


const externalRef = detallesDelPago.external_reference;
if (!externalRef) {
Logger.log("Pago " + paymentId + " no tiene external_reference. Ignorando.");
return;
}
const refParts = externalRef.split('-');
const dniInscripto = refParts[0];
const cuotaNum = refParts.length > 1 ? refParts[1] : null;


const estado = detallesDelPago.status;
const paymentIdOperacion = detallesDelPago.id;


const pagador = detallesDelPago.payer || {};
let pagadorNombre = `${pagador.first_name || ''} ${pagador.last_name || ''}`.trim();
if (!pagadorNombre && detallesDelPago.card && detallesDelPago.card.holder && detallesDelPago.card.holder.name) {
pagadorNombre = detallesDelPago.card.holder.name.trim();
}
if (!pagadorNombre && pagador.nickname) {
pagadorNombre = pagador.nickname.trim();
}
if (!pagadorNombre && pagador.email) {
pagadorNombre = pagador.email.trim();
}
const pagadorDni = (pagador.identification && pagador.identification.number) ? pagador.identification.number : 'N/D';


const urlComprobante = (detallesDelPago.transaction_details && detallesDelPago.transaction_details.external_resource_url)
? detallesDelPago.transaction_details.external_resource_url
: 'N/D';


Logger.log(`Info pago -> Ref: ${externalRef}, DNI: ${dniInscripto}, Cuota: ${cuotaNum}, Estado: ${estado}, ID Op: ${paymentIdOperacion}, Pagador: ${pagadorNombre}`);


if (estado === 'approved' && dniInscripto) {
Logger.log("Pago APROBADO. Actualizando planilla...");
const datosActualizacion = {
cuotaNum: cuotaNum,
idOperacion: paymentIdOperacion,
nombrePagador: pagadorNombre || "N/A",
dniPagador: pagadorDni,
urlComprobante: urlComprobante
};
// (M) Llamamos a la función con la lógica de bloqueo de repago (SIN EXPIRACIÓN)
actualizarEstadoEnPlanilla(dniInscripto, datosActualizacion);
} else {
Logger.log(`Pago no aprobado (estado: ${estado}) o sin DNI inscripto. No se realizan cambios.`);
}
} catch (e) {
Logger.log("Error fatal en procesarNotificacionDePago: " + e.toString());
} finally {
lock.releaseLock();
}
}


// =========================================================
// (M) actualizarEstadoEnPlanilla (SIMPLIFICADO)
// Se eliminó la lógica de 'expirarPreferenciaMP'.
// SE MANTIENE EL BLOQUEO DE REPAGO (el check de si ya está "Pagada")
// =========================================================
function actualizarEstadoEnPlanilla(dni, datosActualizacion) {
const lock = LockService.getScriptLock();
lock.waitLock(30000);
try {
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hoja = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (!hoja) {
Logger.log(`La hoja "${NOMBRE_HOJA_REGISTRO}" no fue encontrada.`);
return;
}
const rangoDni = hoja.getRange(2, COL_DNI_INSCRIPTO, hoja.getLastRow() - 1, 1);
const celdaEncontrada = rangoDni.createTextFinder(String(dni).trim()).findNext();


if (celdaEncontrada) {
const fila = celdaEncontrada.getRow();
const cuotaNum = datosActualizacion.cuotaNum; // "C1", "C2", "C3" o null


const rangoFila = hoja.getRange(fila, 1, 1, hoja.getLastColumn());
const rowData = rangoFila.getValues()[0];


// --- (M) ¡¡¡LÓGICA DE BLOQUEO DE REPAGO!!! (ESTO ES LO IMPORTANTE) ---
if (cuotaNum == null) {
// Es un PAGO TOTAL (Pago Online)
const estadoActual = rowData[COL_ESTADO_PAGO - 1];
if (estadoActual && (estadoActual.toString().includes("Pagado") || estadoActual.toString().includes("Notificada"))) {
Logger.log(`REPAGO IGNORADO: Fila ${fila} (DNI ${dni}) ya tiene un Pago Total. Ignorando PaymentID ${datosActualizacion.idOperacion}.`);
return; // No hacer nada
}
// (M) Si no está pagado, marcarlo
hoja.getRange(fila, COL_ESTADO_PAGO).setValue("Pagado");
Logger.log(`Éxito: Fila ${fila} (Pago Total) actualizada para DNI ${dni}.`);
enviarEmailPagoConfirmado(rowData);


} else {
// Es un PAGO DE CUOTA
const cuotaIndex = parseInt(cuotaNum.replace('C',''));
let columnaCuota;


if (cuotaIndex === 1) columnaCuota = COL_CUOTA_1;
else if (cuotaIndex === 2) columnaCuota = COL_CUOTA_2;
else if (cuotaIndex === 3) columnaCuota = COL_CUOTA_3;
else return; // No es C1, C2, o C3


const estadoActualCuota = rowData[columnaCuota - 1];
if (estadoActualCuota && (estadoActualCuota.toString().includes("Pagada") || estadoActualCuota.toString().includes("Notificada"))) {
Logger.log(`REPAGO IGNORADO: Fila ${fila} (DNI ${dni}) ya tiene ${cuotaNum} pagada. Ignorando PaymentID ${datosActualizacion.idOperacion}.`);
return; // No hacer nada
}


// (M) Si no está pagada, marcarla
hoja.getRange(fila, columnaCuota).setValue(`C${cuotaIndex} Pagada`);
Logger.log(`Éxito: Fila ${fila} (${cuotaNum}) marcada como PAGADA para DNI ${dni}.`);
}
// --- (FIN DE LA LÓGICA DE BLOQUEO) ---


// Si pasó el bloqueo, procede a actualizar los datos del pagador y ID
const isCuotaPayment = cuotaNum !== null;


// (i) Función helper 1: Anexar siempre (MODIFICADA CON TIMESTAMP)
function actualizarCelda_AnexarSiempre(columna, nuevoValor) {
const celda = hoja.getRange(fila, columna);
let nuevoValorStr = String(nuevoValor).trim();


if (columna === COL_ID_PAGO_MP) {
const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
nuevoValorStr = `${nuevoValorStr} (${timestamp})`;
}


if (isCuotaPayment) {
const valorAntiguo = celda.getValue();
const valorAntiguoStr = (valorAntiguo) ? String(valorAntiguo).trim() : "";


if (valorAntiguoStr && valorAntiguoStr !== 'N/D') {
const listaValoresAntiguos = valorAntiguoStr.split(',').map(s => s.trim());
const idBaseNuevo = String(nuevoValor).trim();
const idYaExiste = listaValoresAntiguos.some(v => v.startsWith(idBaseNuevo));


if (!idYaExiste) {
celda.setValue(`${valorAntiguoStr}, ${nuevoValorStr}`);
} else {
Logger.log(`Valor ${nuevoValorStr} ya existe en Col ${columna}. No se anexa.`);
}
} else {
celda.setValue(nuevoValorStr);
}
} else {
celda.setValue(nuevoValorStr);
}
}


// Función helper 2: Anexar solo si el nuevo valor es diferente
function actualizarCelda_AnexarSiDiferente(columna, nuevoValor) {
const celda = hoja.getRange(fila, columna);
const nuevoValorStr = String(nuevoValor).trim();


if (nuevoValorStr === 'N/D' && isCuotaPayment) {
return;
}


if (isCuotaPayment) {
const valorAntiguo = celda.getValue();
const valorAntiguoStr = (valorAntiguo) ? String(valorAntiguo).trim() : "";


if (!valorAntiguoStr || valorAntiguoStr === 'N/D') {
celda.setValue(nuevoValorStr);
return;
}


const listaValoresAntiguos = valorAntiguoStr.split(',').map(s => s.trim());


if (listaValoresAntiguos.includes(nuevoValorStr)) {
return;
} else {
celda.setValue(`${valorAntiguoStr}, ${nuevoValorStr}`);
}
} else {
celda.setValue(nuevoValorStr);
}
}


// Llamadas a los helpers
actualizarCelda_AnexarSiempre(COL_ID_PAGO_MP, datosActualizacion.idOperacion);
actualizarCelda_AnexarSiempre(COL_COMPROBANTE_MP, datosActualizacion.urlComprobante);
actualizarCelda_AnexarSiDiferente(COL_PAGADOR_NOMBRE, datosActualizacion.nombrePagador);
actualizarCelda_AnexarSiDiferente(COL_PAGADOR_DNI, datosActualizacion.dniPagador);


// --- LÓGICA DE ACTUALIZACIÓN DE ESTADO (Va después del bloqueo) ---
if (cuotaNum != null) {
// Es un PAGO DE CUOTA (Ya la marcamos como pagada)
// Revisar si se completaron todas
const cantidadCuotasRegistrada = parseInt(hoja.getRange(fila, COL_CANTIDAD_CUOTAS).getValue()) || 3;
let cuotasPagadas = 0;


const rowDataActualizada = hoja.getRange(fila, 1, 1, hoja.getLastColumn()).getValues()[0];


for (let i = 1; i <= cantidadCuotasRegistrada; i++) {
let colCuota = i === 1 ? COL_CUOTA_1 : (i === 2 ? COL_CUOTA_2 : COL_CUOTA_3);
let cuota_status = rowDataActualizada[colCuota - 1];
if (cuota_status && (cuota_status.toString().includes("Pagada") || cuota_status.toString().includes("Notificada"))) {
cuotasPagadas++;
}
}


if (cuotasPagadas === cantidadCuotasRegistrada) {
hoja.getRange(fila, COL_ESTADO_PAGO).setValue("Pagado");
Logger.log(`DNI ${dni}: ¡Todas las cuotas pagadas! Estado general actualizado.`);
enviarEmailInscripcionCompleta(rowData);
}
}


// (M) Llamada a expirarPreferenciaMP ELIMINADA


} else {
Logger.log(`No se encontró registro con DNI ${dni} para actualizar.`);
}
} catch (e) {
Logger.log(`Error al actualizar planilla para DNI ${dni}: ${e.toString()}`);
} finally {
lock.releaseLock();
}
}
// =========================================================
// (FIN DE LA CORRECCIÓN)
// =========================================================


// ========================================================================
// (FUNCIONES DE EMAIL REVISADAS)
// (g) Lógica de tracking eliminada
// ========================================================================


/* */
function enviarEmailPagoConfirmado(rowData) {
try {
const email = rowData[COL_EMAIL - 1];
const responsable1 = rowData[COL_ADULTO_RESPONSABLE_1 - 1];


if (!email || !responsable1) return;


const asunto = "Pago confirmado!!";
const cuerpo = `Hola Sr/a ${responsable1}\n\nEl pago de la inscripción se ha efectuado correctamente.\nBienvenido en la Escuela de Verano.`;


MailApp.sendEmail(email, asunto, cuerpo);
} catch (e) {
Logger.log("Error en enviarEmailPagoConfirmado: " + e.message);
}
}


/**
* (g) Lógica de tracking de email eliminada
*/
function enviarEmailInscripcionCompleta(rowData) {
try {


const email = rowData[COL_EMAIL - 1];
const responsable1 = rowData[COL_ADULTO_RESPONSABLE_1 - 1];


if (!email || !responsable1) return;


const asunto = "Inscripción COMPLETA y Confirmada";
const cuerpo = `Hola Sr/a ${responsable1},\n\n¡FELICITACIONES! El pago de la inscripción se ha completado en su totalidad.\n\nEl cupo está 100% confirmado.\n¡Bienvenido/a en la Escuela de Verano!`;


MailApp.sendEmail(email, asunto, cuerpo);


Logger.log(`Email de Inscripción Completa enviado a ${email}.`);
} catch (e) {
Logger.log("Error en enviarEmailInscripcionCompleta: " + e.message);
}
}
