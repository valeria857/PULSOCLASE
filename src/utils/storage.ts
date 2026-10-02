/**
 * Utilidades de almacenamiento local (LocalStorage) para PULSO CLASE
 */

import { ConteoVotos, SesionClase, VotoRegistro } from '../types';

export const CLAVE_LOCALSTORAGE = 'pulso_clase_sesion_v1';
export const CLAVE_HISTORIAL = 'pulso_clase_historial_v1';

export const TEMA_PREDETERMINADO = 'Matemática - Derivadas y Funciones';
export const PREGUNTA_PREDETERMINADA = '¿Qué tan claro quedó el tema visto en la clase de hoy?';

export const CONTEOS_INICIALES: ConteoVotos = {
  'Entendí': 0,
  'Tengo dudas': 0,
  'Me perdí': 0,
};

export const SESION_INICIAL: SesionClase = {
  tema: TEMA_PREDETERMINADO,
  pregunta: PREGUNTA_PREDETERMINADA,
  votos: [],
  conteos: { ...CONTEOS_INICIALES },
  creadaEn: new Date().toISOString(),
};

/**
 * Carga la sesión almacenada en el navegador.
 * 
 * ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
 * 1. Intentar hacer JSON.parse(null) o no envolver en un try/catch:
 *    Si el usuario tiene datos corruptos en el navegador o está en modo incógnito estricto,
 *    la aplicación se rompería con pantalla blanca si no se maneja el error.
 * 2. Si la estructura guardada no tiene todas las claves ('Entendí', 'Tengo dudas', 'Me perdí'),
 *    se debe asegurar que existan para no obtener `undefined` al calcular totales o sumar porcentajes.
 */
export function cargarSesion(): SesionClase {
  try {
    const raw = localStorage.getItem(CLAVE_LOCALSTORAGE);
    if (!raw) {
      return SESION_INICIAL;
    }
    const parseado = JSON.parse(raw);
    
    // Verificación defensiva de la integridad de los datos
    return {
      tema: typeof parseado.tema === 'string' && parseado.tema.trim().length > 0
        ? parseado.tema
        : TEMA_PREDETERMINADO,
      pregunta: typeof parseado.pregunta === 'string' && parseado.pregunta.trim().length > 0 
        ? parseado.pregunta 
        : PREGUNTA_PREDETERMINADA,
      votos: Array.isArray(parseado.votos) ? parseado.votos : [],
      conteos: {
        'Entendí': Number(parseado.conteos?.['Entendí']) || 0,
        'Tengo dudas': Number(parseado.conteos?.['Tengo dudas']) || 0,
        'Me perdí': Number(parseado.conteos?.['Me perdí']) || 0,
      },
      creadaEn: parseado.creadaEn || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Aviso: Error al leer datos de localStorage, se reinicia la sesión inicial.', error);
    return SESION_INICIAL;
  }
}

/**
 * Guarda la sesión de clase en LocalStorage de forma segura.
 */
export function guardarSesion(sesion: SesionClase): void {
  try {
    localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(sesion));
  } catch (error) {
    console.warn('Aviso: No fue posible persistir en localStorage (posible cuota excedida o modo privado).', error);
  }
}

/**
 * Agrega un nuevo voto a la sesión actual y recalcula los conteos de forma inmutable.
 * 
 * ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
 * Mutar el objeto `conteos` directamente (ej: `sesion.conteos[voto]++`) en React
 * provoca que los componentes no detecten el cambio de estado y el gráfico no se actualice.
 * Siempre se debe retornar un nuevo objeto con las copias superficiales (spread operator).
 */
export function registrarVotoEnSesion(
  sesionActual: SesionClase,
  opcion: 'Entendí' | 'Tengo dudas' | 'Me perdí',
  comentarioOpcional?: string
): SesionClase {
  const nuevoVoto: VotoRegistro = {
    id: `voto_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    opcion,
    comentario: comentarioOpcional?.trim() ? comentarioOpcional.trim() : undefined,
    fechaHora: new Date().toISOString(),
  };

  const nuevaSesion: SesionClase = {
    ...sesionActual,
    votos: [nuevoVoto, ...sesionActual.votos],
    conteos: {
      ...sesionActual.conteos,
      [opcion]: (sesionActual.conteos[opcion] || 0) + 1,
    },
  };

  guardarSesion(nuevaSesion);
  return nuevaSesion;
}

/**
 * Guarda la sesión que está terminando en el historial de sesiones archivadas.
 * 
 * ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
 * Si la sesión actual no tiene ningún voto registrado (total = 0), archivarla crearía
 * un historial lleno de sesiones vacías innecesarias. Solo archivamos si contiene información útil,
 * o le asignamos un identificador único con fecha para que el docente pueda consultarla luego.
 */
export function guardarSesionEnHistorial(sesion: SesionClase): void {
  try {
    const totalVotos =
      sesion.conteos['Entendí'] +
      sesion.conteos['Tengo dudas'] +
      sesion.conteos['Me perdí'];

    // Si no tiene votos ni comentarios, no sobrecargamos el historial
    if (totalVotos === 0 && sesion.votos.length === 0) {
      return;
    }

    const historialPrevio = cargarHistorial();
    const sesionArchivada: SesionClase = {
      ...sesion,
      creadaEn: sesion.creadaEn || new Date().toISOString(),
    };

    // Agregamos al inicio para que las más recientes aparezcan primero
    const nuevoHistorial = [sesionArchivada, ...historialPrevio].slice(0, 30); // Limitar a las últimas 30 clases
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(nuevoHistorial));
  } catch (error) {
    console.warn('Aviso: No fue posible archivar la sesión en el historial.', error);
  }
}

/**
 * Recupera la lista de sesiones archivadas previamente.
 */
export function cargarHistorial(): SesionClase[] {
  try {
    const raw = localStorage.getItem(CLAVE_HISTORIAL);
    if (!raw) return [];
    const parseado = JSON.parse(raw);
    return Array.isArray(parseado) ? parseado : [];
  } catch (error) {
    console.error('Aviso: Error al leer historial de sesiones.', error);
    return [];
  }
}
