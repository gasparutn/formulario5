// --- CONSTANTES GLOBALES ---
const SPREADSHEET_ID = '1Ru-XGng2hYJbUvl-H2IA7aYQx7Ju-jk1LT1fkYOnG0w';
/* */
const NOMBRE_HOJA_BUSQUEDA = 'Base de Datos';
const NOMBRE_HOJA_REGISTRO = 'Registros';
const NOMBRE_HOJA_CONFIG = 'Config';

/* */
const FOLDER_ID_FOTOS = '1S2SbkuYdvcLFZYoHacfgwEU80kAN094l';
const FOLDER_ID_FICHAS = '1aDsTTDWHiDFUeZ8ByGp8_LY3fdzVQomu';
const FOLDER_ID_COMPROBANTES = '169EISq4RsDetQ0H3B17ViZFfe25xPcMM';

// =========================================================
// (Punto 1) CONSTANTES "Base de Datos" ACTUALIZADAS
// =========================================================
const COL_HABILITADO_BUSQUEDA = 2; // Col B
const COL_NOMBRE_BUSQUEDA = 3; // Col C (NUEVA)
const COL_APELLIDO_BUSQUEDA = 4; // Col D (NUEVA)
const COL_FECHA_NACIMIENTO_BUSQUEDA = 5; // Col E (antes D=4)
// Col F (Edad) se salta
const COL_DNI_BUSQUEDA = 7; // Col G (antes F=6)
const COL_OBRASOCIAL_BUSQUEDA = 8; // Col H (antes G=7)
const COL_COLEGIO_BUSQUEDA = 9; // Col I (antes H=8)
const COL_RESPONSABLE_BUSQUEDA = 10; // Col J (antes I=9)
const COL_TELEFONO_BUSQUEDA = 11; // Col K (antes J=10)

// =========================================================
// (Punto 2, 3, 4, 5) CONSTANTES "Registros" ACTUALIZADAS (41 columnas)
// =========================================================
const COL_NUMERO_TURNO = 1; // A
const COL_MARCA_TEMPORAL = 2; // B
const COL_MARCA_N_E_A = 3; // C
const COL_ESTADO_NUEVO_ANT = 4; // D
const COL_EMAIL = 5; // E
const COL_NOMBRE = 6; // F (NUEVA - Punto 2)
const COL_APELLIDO = 7; // G (NUEVA - Punto 2)
const COL_FECHA_NACIMIENTO_REGISTRO = 8; // H (antes G=7)
const COL_EDAD_ACTUAL = 9; // I (antes H=8)
const COL_DNI_INSCRIPTO = 10; // J (antes I=9)
const COL_OBRA_SOCIAL = 11; // K (antes J=10)
const COL_COLEGIO_JARDIN = 12; // L (antes K=11)
const COL_ADULTO_RESPONSABLE_1 = 13; // M (antes L=12)
const COL_DNI_RESPONSABLE_1 = 14; // N (NUEVA - Punto 5)
const COL_TEL_RESPONSABLE_1 = 15; // O (NUEVA - Punto 3)
const COL_ADULTO_RESPONSABLE_2 = 16; // P (antes M=13)
const COL_TEL_RESPONSABLE_2 = 17; // Q (NUEVA - Punto 3)
const COL_PERSONAS_AUTORIZADAS = 18; // R (antes O=15)
const COL_PRACTICA_DEPORTE = 19; // S (antes P=16)
const COL_ESPECIFIQUE_DEPORTE = 20; // T (antes Q=17)
const COL_TIENE_ENFERMEDAD = 21; // U (antes R=18)
const COL_ESPECIFIQUE_ENFERMEDAD = 22; // V (antes S=19)
const COL_ES_ALERGICO = 23; // W (antes T=20)
const COL_ESPECIFIQUE_ALERGIA = 24; // X (antes U=21)
const COL_APTITUD_FISICA = 25; // Y (antes V=22)
const COL_FOTO_CARNET = 26; // Z (antes W=23)
const COL_JORNADA = 27; // AA (antes X=24)
const COL_METODO_PAGO = 28; // AB (antes Y=25)
const COL_PRECIO = 29; // AC (NUEVA - Punto 4)
const COL_CUOTA_1 = 30; // AD (antes Z=26)
const COL_CUOTA_2 = 31; // AE (antes AA=27)
const COL_CUOTA_3 = 32; // AF (antes AB=28)
const COL_CANTIDAD_CUOTAS = 33; // AG (antes AC=29)
const COL_ESTADO_PAGO = 34; // AH (antes AD=30)
const COL_MONTO_A_PAGAR = 35; // AI (NUEVA - Punto 5)
const COL_ID_PAGO_MP = 36; // AJ (antes AE=31)
const COL_PAGADOR_NOMBRE = 37; // AK (antes AF=32)
const COL_PAGADOR_DNI = 38; // AL (antes AG=33)
const COL_COMPROBANTE_MP = 39; // AM (antes AH=34)
const COL_COMPROBANTE_MANUAL = 40; // AN (antes AI=35)
const COL_ENVIAR_EMAIL_MANUAL = 41; // AO (antes AJ=36)

// =========================================================
// (doGet CORREGIDA)
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

    if (paymentId) {
      Logger.log("doGet detectó regreso de MP. Procesando Payment ID: " + paymentId);
      procesarNotificacionDePago(paymentId); // Vive en Pagos.gs

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
      const htmlTemplate = HtmlService.createTemplateFromFile('Index');
      htmlTemplate.appUrl = appUrl;
      const html = htmlTemplate.evaluate()
        .setTitle("Formulario de Registro")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      return html;
    }
  } catch (err) {
    Logger.log("Error en la detección de parámetros de doGet: " + err.toString());
    return HtmlService.createHtmlOutput("<b>Ocurrió un error:</b> " + err.message);
  }
}

// =========================================================
// (doPost - Webhook)
// =========================================================
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

// =========================================================
// (Punto 5, 11) registrarDatos (ACTUALIZADO)
// =========================================================
/**
* Guarda los datos finales en la hoja "Registros" (41 COLUMNAS)
* (Punto 5, 11) Ahora también registra a los hermanos.
*/
function registrarDatos(datos) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(60000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);
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
        'N° de Turno', 'Marca temporal', 'Marca N/E', 'Estado', // A-D
        'Email', 'Nombre', 'Apellido', // E-G (Punto 2)
        'Fecha de Nacimiento', 'Edad Actual', 'DNI', // H-J
        'Obra Social', 'Colegio/Jardin', // K-L
        'Responsable 1', 'DNI Resp 1', 'Tel Resp 1', // M-O (Punto 3, 5)
        'Responsable 2', 'Tel Resp 2', // P-Q (Punto 3)
        'Autorizados', // R
        'Deporte', 'Espec. Deporte', 'Enfermedad', 'Espec. Enfermedad', 'Alergia', 'Espec. Alergia', // S-X
        'Aptitud Física (Link)', 'Foto Carnet (Link)', // Y-Z
        'Jornada', 'Método de Pago', // AA-AB
        'Precio', // AC (Punto 4)
        'Cuota 1', 'Cuota 2', 'Cuota 3', 'Cantidad Cuotas', // AD-AG
        'Estado de Pago', // AH
        'Monto a Pagar', // AI (Punto 5)
        'ID Pago MP', 'Nombre Pagador', 'DNI Pagador', // AJ-AL
        'Comprobante MP', 'Comprobante Manual', 'Enviar Email?' // AM-AO
      ]);
    }

    // --- CÁLCULO DE PRECIOS ---
    let precio = 0;
    let montoAPagar = 0;
    // (Punto 4, 5) Obtener precios de Config
    try {
      if (datos.metodoPago === 'Pago en Cuotas') {
        precio = hojaConfig.getRange("B20").getValue(); // Precio Cuota
        montoAPagar = precio * (parseInt(datos.cantidadCuotas) || 0);
      } else if (datos.metodoPago === 'Pago 1 Cuota Deb/Cred MP(Total)') {
        precio = hojaConfig.getRange("B14").getValue(); // Precio Total
        montoAPagar = precio;
      }
      // Para Efectivo y Transferencia, el precio puede ser el total, pero el monto a pagar se define en admin.
      // Por ahora, registramos el precio base.
      if (precio === 0) {
        precio = hojaConfig.getRange("B14").getValue();
      }
      if (montoAPagar === 0 && (datos.metodoPago === 'Pago Efectivo (Adm del Club)' || datos.metodoPago === 'Transferencia')) {
         montoAPagar = precio;
      }
    } catch(e) {
      Logger.log("Error al leer precios de config: " + e.message);
    }


    // --- REGISTRO DEL INSCRIPTO PRINCIPAL ---
    const nuevoNumeroDeTurno = hojaRegistro.getLastRow() + 1; // +1 porque aún no hemos agregado la fila

    const edadCalculada = calcularEdad(datos.fechaNacimiento);
    const edadFormateada = `${edadCalculada.anos}a, ${edadCalculada.meses}m, ${edadCalculada.dias}d`;
    const fechaObj = new Date(datos.fechaNacimiento);
    const fechaFormateada = Utilities.formatDate(fechaObj, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
    const marcaNE = (datos.jornada === 'Jornada Normal extendida' ? 'E' : 'N');
    const estadoInscripto = (datos.tipoInscripto === 'nuevo') ? 'Nuevo' : 'Anterior';

    const telResp1 = `(${datos.telAreaResp1}) ${datos.telNumResp1}`;
    const telResp2 = (datos.telAreaResp2 && datos.telNumResp2) ? `(${datos.telAreaResp2}) ${datos.telNumResp2}` : '';

    hojaRegistro.appendRow([
      nuevoNumeroDeTurno, new Date(), marcaNE, estadoInscripto, // A-D
      datos.email, datos.nombre, datos.apellido, // E-G
      fechaFormateada, edadFormateada, dniBuscado, // H-J
      datos.obraSocial, datos.colegioJardin, // K-L
      datos.adultoResponsable1, datos.dniResponsable1, telResp1, // M-O
      datos.adultoResponsable2, telResp2, // P-Q
      datos.personasAutorizadas, // R
      datos.practicaDeporte, datos.especifiqueDeporte, datos.tieneEnfermedad, datos.especifiqueEnfermedad, datos.esAlergico, datos.especifiqueAlergia, // S-X
      datos.urlCertificadoAptitud || '', datos.urlFotoCarnet || '', // Y-Z
      datos.jornada, datos.metodoPago, // AA-AB
      precio, // AC (Precio)
      '', '', '', parseInt(datos.cantidadCuotas) || 0, // AD-AG
      datos.estadoPago, // AH (Estado de Pago)
      montoAPagar, // AI (Monto a Pagar)
      '', '', '', '', '', // AJ-AN (IDs de Pago, etc)
      false // AO (Checkbox)
    ]);
    
    const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    hojaRegistro.getRange(nuevoNumeroDeTurno, COL_ENVIAR_EMAIL_MANUAL).setDataValidation(rule); // Fila es nuevoNumeroDeTurno (no +1)

    // --- (Punto 5, 11) REGISTRO DE HERMANOS ---
    if (datos.hermanos && datos.hermanos.length > 0) {
      const hojaBusqueda = ss.getSheetByName(NOMBRE_HOJA_BUSQUEDA);
      
      for (const hermano of datos.hermanos) {
        const dniHermano = limpiarDNI(hermano.dni);
        if (!dniHermano || !hermano.nombre || !hermano.apellido || !hermano.fechaNac) continue; // Saltar si faltan datos
        
        // (Punto 11) Determinar estado
        let estadoHermano = "Nuevo Hermano/a";
        if (hojaBusqueda && hojaBusqueda.getLastRow() > 1) {
          const rangoDNI = hojaBusqueda.getRange(2, COL_DNI_BUSQUEDA, hojaBusqueda.getLastRow() - 1, 1);
          const celdaEncontrada = rangoDNI.createTextFinder(dniHermano).matchEntireCell(true).findNext();
          if (celdaEncontrada) {
            estadoHermano = "Anterior Hermano/a";
          }
        }
        
        const turnoHermano = hojaRegistro.getLastRow() + 1;
        const edadCalcHermano = calcularEdad(hermano.fechaNac);
        const edadFmtHermano = `${edadCalcHermano.anos}a, ${edadCalcHermano.meses}m, ${edadCalcHermano.dias}d`;
        const fechaObjHermano = new Date(hermano.fechaNac);
        const fechaFmtHermano = Utilities.formatDate(fechaObjHermano, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');

        // (Punto 6) Los hermanos se registran con datos mínimos y estado de pago pendiente
        hojaRegistro.appendRow([
          turnoHermano, new Date(), '', estadoHermano, // A-D
          datos.email, hermano.nombre, hermano.apellido, // E-G
          fechaFmtHermano, edadFmtHermano, dniHermano, // H-J
          '', '', // K-L (Obra social, Colegio VACÍOS)
          datos.adultoResponsable1, datos.dniResponsable1, telResp1, // M-O (Datos del Resp 1)
          datos.adultoResponsable2, telResp2, // P-Q (Datos del Resp 2)
          datos.personasAutorizadas, // R (Autorizados)
          '', '', '', '', '', '', // S-X (Salud VACÍO)
          '', '', // Y-Z (Aptitud, Foto VACÍOS)
          '', '', // AA-AB (Jornada, Método Pago VACÍOS)
          0, // AC (Precio)
          '', '', '', 0, // AD-AG (Cuotas)
          'Pendiente (Hermano)', // AH (Estado de Pago)
          0, // AI (Monto a Pagar)
          '', '', '', '', '', // AJ-AN
          false // AO
        ]);
        hojaRegistro.getRange(turnoHermano, COL_ENVIAR_EMAIL_MANUAL).setDataValidation(rule);
      }
    }
    
    SpreadsheetApp.flush();
    obtenerEstadoRegistro(); // Actualiza el contador de cupos

    // Devolver solo los datos del inscripto principal
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
      case 'ficha': parentFolderId = FOLDER_ID_FICHAS; break;
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

/* */
function obtenerEstadoRegistro() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);
    const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
    if (!hojaConfig) throw new Error(`Hoja "${NOMBRE_HOJA_CONFIG}" no encontrada.`);

    const limiteCupos = parseInt(hojaConfig.getRange('B1').getValue()) || 100;
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
    hojaConfig.getRange('B5').setValue(registrosJornadaExtendida);
    SpreadsheetApp.flush();

    return {
      alcanzado: registrosActuales >= limiteCupos,
      jornadaExtendidaAlcanzada: registrosJornadaExtendida >= limiteJornadaExtendida,
      cierreManual: !formularioAbierto
    };
  } catch (e) {
    Logger.log("Error en obtenerEstadoRegistro: " + e.message);
    return { cierreManual: true, message: "Error al leer config: " + e.message };
  }
}

// =========================================================
// (Punto 1, 6, 7, 12) validarAcceso (ACTUALIZADO)
// =========================================================
function validarAcceso(dni, tipoInscripto) {
  try {
    const estado = obtenerEstadoRegistro();
    if (estado.cierreManual) return { status: 'CERRADO', message: 'El formulario se encuentra cerrado por mantenimiento.' };
    if (estado.alcanzado && tipoInscripto === 'nuevo') return { status: 'LIMITE_ALCANZADO', message: 'Se ha alcanzado el cupo máximo para nuevos registros.' };

    if (!dni) return { status: 'ERROR', message: 'El DNI no puede estar vacío.' };
    const dniLimpio = limpiarDNI(dni);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 1. BUSCAR EN "Registros"
    const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
    if (hojaRegistro && hojaRegistro.getLastRow() > 1) {
      // (Punto 2) COL_DNI_INSCRIPTO ahora es J (10)
      const rangoDniRegistro = hojaRegistro.getRange(2, COL_DNI_INSCRIPTO, hojaRegistro.getLastRow() - 1, 1);
      const celdaRegistro = rangoDniRegistro.createTextFinder(dniLimpio).matchEntireCell(true).findNext();

      if (celdaRegistro) {
        const filaRegistro = celdaRegistro.getRow();
        const rangoFila = hojaRegistro.getRange(filaRegistro, 1, 1, hojaRegistro.getLastColumn()).getValues()[0];

        const estadoPago = rangoFila[COL_ESTADO_PAGO - 1];
        const metodoPago = rangoFila[COL_METODO_PAGO - 1];
        const nombreRegistrado = rangoFila[COL_NOMBRE - 1] + ' ' + rangoFila[COL_APELLIDO - 1];
        const estadoInscripto = rangoFila[COL_ESTADO_NUEVO_ANT - 1];

        // --- (Punto 6, 12) LÓGICA DE HERMANOS ---
        if (estadoInscripto === 'Nuevo Hermano/a' || estadoInscripto === 'Anterior Hermano/a') {
          // (Punto 6, 8) Verificar campos requeridos faltantes
          let faltantes = [];
          if (!rangoFila[COL_OBRA_SOCIAL - 1]) faltantes.push('Obra Social');
          if (!rangoFila[COL_COLEGIO_JARDIN - 1]) faltantes.push('Colegio / Jardín');
          if (!rangoFila[COL_PRACTICA_DEPORTE - 1]) faltantes.push('Practica Deporte');
          if (!rangoFila[COL_TIENE_ENFERMEDAD - 1]) faltantes.push('Enfermedad Preexistente');
          if (!rangoFila[COL_ES_ALERGICO - 1]) faltantes.push('Alergias');
          if (!rangoFila[COL_FOTO_CARNET - 1]) faltantes.push('Foto Carnet 4x4');
          if (!rangoFila[COL_JORNADA - 1]) faltantes.push('Jornada');
          if (!rangoFila[COL_METODO_PAGO - 1]) faltantes.push('Método de Pago');
          // (Punto 9) Personas autorizadas
          if (!rangoFila[COL_PERSONAS_AUTORIZADAS - 1]) faltantes.push('Personas Autorizadas');
          
          // (Punto 7) Pre-cargar datos existentes
          const datos = {
            dni: dniLimpio,
            nombre: rangoFila[COL_NOMBRE - 1],
            apellido: rangoFila[COL_APELLIDO - 1],
            fechaNacimiento: rangoFila[COL_FECHA_NACIMIENTO_REGISTRO - 1] ? Utilities.formatDate(new Date(rangoFila[COL_FECHA_NACIMIENTO_REGISTRO - 1]), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd') : '',
            adultoResponsable1: rangoFila[COL_ADULTO_RESPONSABLE_1 - 1],
            dniResponsable1: rangoFila[COL_DNI_RESPONSABLE_1 - 1],
            telResponsable1: rangoFila[COL_TEL_RESPONSABLE_1 - 1],
            adultoResponsable2: rangoFila[COL_ADULTO_RESPONSABLE_2 - 1],
            telResponsable2: rangoFila[COL_TEL_RESPONSABLE_2 - 1],
            personasAutorizadas: rangoFila[COL_PERSONAS_AUTORIZADAS - 1],
            // Los campos de salud, etc., se cargarán pero el usuario debe confirmarlos/completarlos
            obraSocial: rangoFila[COL_OBRA_SOCIAL - 1],
            colegioJardin: rangoFila[COL_COLEGIO_JARDIN - 1]
          };
          
          // (Punto 12) Mensaje de campos faltantes
          if (faltantes.length > 0) {
             return {
                status: 'HERMANO_COMPLETAR',
                message: `⚠️ ¡Hola ${datos.nombre}! Eres un hermano/a pre-registrado.\n` +
                         `Tiene que completar el registro para obtener el cupo definitivo y el link para pagar.\n` +
                         `Campos requeridos faltantes: <strong>${faltantes.join(', ')}</strong>.`,
                datos: datos,
                jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
                tipoInscripto: estadoInscripto // Pasa el tipo
             };
          }
          // Si no faltan campos, tratar como un duplicado pendiente de pago
        }
        // --- FIN LÓGICA HERMANOS ---

        if (estadoPago === 'Pagado') {
          const aptitudFisica = rangoFila[COL_APTITUD_FISICA - 1];
          const adeudaAptitud = !aptitudFisica;
          return {
            status: 'DUPLICADO_PAGADO',
            message: `✅ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO y la inscripción está PAGADA.`,
            adeudaAptitud: adeudaAptitud
          };
        }

        if (String(metodoPago).includes('Efectivo') || String(metodoPago).includes('Transferencia')) {
          return {
            status: 'DUPLICADO_PENDIENTE_EFECTIVO', // Reusamos este estado
            message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO. El pago (${metodoPago}) está PENDIENTE.`
          };
        }

        // Lógica de repago (igual que antes)
        try {
          const datosParaPago = {
            dni: dniLimpio,
            apellidoNombre: nombreRegistrado, // (Pagos.js espera 'apellidoNombre')
            email: rangoFila[COL_EMAIL - 1],
            metodoPago: metodoPago,
            jornada: rangoFila[COL_JORNADA - 1]
          };

          let identificadorPago = null;
          if (metodoPago === 'Pago en Cuotas') {
            const cantidadCuotasRegistrada = parseInt(rangoFila[COL_CANTIDAD_CUOTAS - 1]) || 3;
            for (let i = 1; i <= cantidadCuotasRegistrada; i++) {
              let colCuota = i === 1 ? COL_CUOTA_1 : (i === 2 ? COL_CUOTA_2 : COL_CUOTA_3);
              let cuota_status = rangoFila[colCuota - 1];
              if (!cuota_status || (!cuota_status.toString().includes("Pagada") && !cuota_status.toString().includes("Notificada"))) {
                identificadorPago = `C${i}`;
                break;
              }
            }
            if (identificadorPago == null) {
              return { status: 'DUPLICADO_PAGADO', message: `✅ El DNI ${dniLimpio} (${nombreRegistrado}) ya completó todas las cuotas.`, adeudaAptitud: !rangoFila[COL_APTITUD_FISICA - 1] };
            }
          }

          const init_point = crearPreferenciaDePago(datosParaPago, identificadorPago, rangoFila[COL_CANTIDAD_CUOTAS - 1]);
          if (!init_point || !init_point.toString().startsWith('http')) {
            return { status: 'DUPLICADO_PENDIENTE_ERROR', message: `⚠️ Error al generar link: ${init_point}` };
          }
          return { status: 'DUPLICADO_PENDIENTE_PAGO', message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO. Se generó un link para la próxima cuota pendiente (${identificadorPago || 'Pago Total'}).`, init_point: init_point };

        } catch (e) {
          return { status: 'DUPLICADO_PENDIENTE_ERROR', message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado}) ya se encuentra REGISTRADO. Pago PENDIENTE, pero error al generar link: ${e.message}` };
        }
      }
    }
    // --- FIN BÚSQUEDA "Registros" ---

    // 2. (Punto 1) VALIDACIÓN "Base de Datos"
    const hojaBusqueda = ss.getSheetByName(NOMBRE_HOJA_BUSQUEDA);
    if (!hojaBusqueda) return { status: 'ERROR', message: `La hoja "${NOMBRE_HOJA_BUSQUEDA}" no fue encontrada.` };

    // (Punto 1) COL_DNI_BUSQUEDA ahora es G (7)
    const rangoDNI = hojaBusqueda.getRange(2, COL_DNI_BUSQUEDA, hojaBusqueda.getLastRow() - 1, 1);
    const celdaEncontrada = rangoDNI.createTextFinder(dniLimpio).matchEntireCell(true).findNext();

    if (celdaEncontrada) {
      if (tipoInscripto === 'nuevo') {
        return { status: 'ERROR_TIPO_NUEVO', message: "El DNI se encuentra en la base datos, cambie 'SOY INSCRIPTO ANTERIOR' y valide nuevamente" };
      }

      const rowIndex = celdaEncontrada.getRow();
      // (Punto 1) El rango ahora es de B(2) a K(11), 10 columnas
      const fila = hojaBusqueda.getRange(rowIndex, COL_HABILITADO_BUSQUEDA, 1, 10).getValues()[0];
      
      const habilitado = fila[0]; // fila[0] es COL_HABILITADO_BUSQUEDA (B)
      if (habilitado !== true) {
        return { status: 'NO_HABILITADO', message: 'El dni se encuentra en la base de datos, pero no esta habilitado para la inscripción, consulte con la organización:' };
      }

      // (Punto 1, 7) Extracción de datos con nuevas columnas
      const nombre = fila[1]; // Col C (índice 1)
      const apellido = fila[2]; // Col D (índice 2)
      const fechaNacimientoRaw = fila[3]; // Col E (índice 3)
      const obraSocial = String(fila[6] || '').trim(); // Col H (índice 6)
      const colegioJardin = String(fila[7] || '').trim(); // Col I (índice 7)
      const responsable = String(fila[8] || '').trim(); // Col J (índice 8)
      const telefono = String(fila[9] || '').trim(); // Col K (índice 9)

      const fechaNacimientoStr = (fechaNacimientoRaw instanceof Date) ? Utilities.formatDate(fechaNacimientoRaw, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd') : (fechaNacimientoRaw ? new Date(fechaNacimientoRaw).toISOString().split('T')[0] : '');

      // (Punto 7) Devolver datos para pre-rellenar
      return {
        status: 'OK',
        datos: {
          nombre: nombre,
          apellido: apellido,
          dni: dniLimpio,
          fechaNacimiento: fechaNacimientoStr,
          obraSocial: obraSocial,
          colegioJardin: colegioJardin,
          adultoResponsable1: responsable,
          telResponsable1: telefono // Asumimos que el tel de la BD va al Resp 1
        },
        edad: calcularEdad(fechaNacimientoStr),
        jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
        tipoInscripto: tipoInscripto
      };

    } else {
      if (tipoInscripto === 'anterior') {
        return { status: 'ERROR_TIPO_ANT', message: "No se encuentra en la base de datos, por favor seleccione 'SOY NUEVO INSCRIPTO'" };
      }
      return {
        status: 'OK_NUEVO',
        message: '✅ DNI validado. Proceda al registro.',
        jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
        tipoInscripto: tipoInscripto,
        datos: { dni: dniLimpio }
      };
    }

  } catch (e) {
    Logger.log("Error en validarAcceso: " + e.message);
    return { status: 'ERROR', message: 'Ocurrió un error al validar el DNI. ' + e.message };
  }
}

// =========================================================
// (Punto 10) enviarEmailConfirmacion (ACTUALIZADO)
// =========================================================
/**
* (M) FUNCIÓN DE EMAIL (SIMPLIFICADA)
* (Punto 10) Agrega template para "Transferencia"
*/
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

    // (Punto 2) Usar nombre y apellido
    const nombreCompleto = `${datos.nombre} ${datos.apellido}`;

    if (metodo === 'Pago 1 Cuota Deb/Cred MP(Total)') {
      asunto = hojaConfig.getRange('E2:G2').getValue();
      cuerpoOriginal = hojaConfig.getRange('D4:H8').getValue();
      if (!asunto) asunto = "Confirmación de Registro (Pago Total)";
      if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nLink de Pago: {{linkDePago}}";

      cuerpoFinal = cuerpoOriginal
        .replace(/{{nombreCompleto}}/g, nombreCompleto)
        .replace(/{{numeroDeTurno}}/g, numeroDeTurno)
        .replace(/{{linkDePago}}/g, init_point || 'N/A');

    } else if (metodo === 'Pago Efectivo (Adm del Club)' || metodo === 'registro_sin_pago') {
      asunto = hojaConfig.getRange('E13:H13').getValue();
      cuerpoOriginal = hojaConfig.getRange('D15:H19').getValue();
      if (!asunto) asunto = "Confirmación de Registro (Pago Efectivo)";
      if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nPor favor, acérquese a la administración.";

      cuerpoFinal = cuerpoOriginal
        .replace(/{{nombreCompleto}}/g, nombreCompleto)
        .replace(/{{numeroDeTurno}}/g, numeroDeTurno);

    // (Punto 10) NUEVO CASO PARA TRANSFERENCIA
    } else if (metodo === 'Transferencia') {
        asunto = "Confirmación de Registro (Transferencia)"; // Asunto genérico (o agregar a Config)
        cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\n" +
                         "Por favor, realice la transferencia a:\n" +
                         "TITULAR DE LA CUENTA: Walter Jonas Marrello\n" +
                         "Alias: clubhipicomendoza\n\n" +
                         "IMPORTANTE: Una vez realizada, vuelva a ingresar al formulario con su DNI para subir el comprobante.";

        cuerpoFinal = cuerpoOriginal
          .replace(/{{nombreCompleto}}/g, nombreCompleto)
          .replace(/{{numeroDeTurno}}/g, numeroDeTurno);

    } else if (metodo === 'Pago en Cuotas') {
      asunto = hojaConfig.getRange('E24:G24').getValue();
      cuerpoOriginal = hojaConfig.getRange('D26:H30').getValue();
      if (!asunto) asunto = "Confirmación de Registro (Cuotas)";
      if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nLink Cuota 1: {{linkCuota1}}\nLink Cuota 2: {{linkCuota2}}\nLink Cuota 3: {{linkCuota3}}";

      cuerpoFinal = cuerpoOriginal
        .replace(/{{nombreCompleto}}/g, nombreCompleto)
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

/* */
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
      hoja.getRange(fila, COL_ESTADO_PAGO).setValue("En revisión"); // (Punto 10) Funciona para Transferencia

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

/* */
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

/* */
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