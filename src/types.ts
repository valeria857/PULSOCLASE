/**
 * Tipos de datos para PULSO CLASE
 */

// ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
// Los tipos de voto deben coincidir exactamente con las tres opciones requeridas.
// Si se usan mayúsculas o acentos inconsistentes en el código (ej. "Entendi" sin tilde o "me perdí"),
// las comparaciones lógicas y el conteo de votos fallarán silenciosamente.
export type OpcionVoto = 'Entendí' | 'Tengo dudas' | 'Me perdí';

export interface VotoRegistro {
  id: string;
  opcion: OpcionVoto;
  comentario?: string;
  fechaHora: string; // ISO string para trazabilidad
}

export interface ConteoVotos {
  'Entendí': number;
  'Tengo dudas': number;
  'Me perdí': number;
}

export interface SesionClase {
  tema: string; // Tema o materia de la clase actual
  pregunta: string;
  votos: VotoRegistro[];
  conteos: ConteoVotos;
  creadaEn: string;
}
