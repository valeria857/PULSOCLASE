import { useState, useEffect } from 'react';
import { BookOpen, Check, Edit2 } from 'lucide-react';

interface ClassTopicSelectorProps {
  temaActual: string;
  onActualizarTema: (nuevoTema: string) => void;
}

// Sugerencias rápidas frecuentes para que el docente elija con 1 toque en el celular
const MATERIAS_SUGERIDAS = [
  'Matemática',
  'Lengua y Literatura',
  'Física',
  'Química',
  'Historia',
  'Biología',
  'Programación',
];

export function ClassTopicSelector({
  temaActual,
  onActualizarTema,
}: ClassTopicSelectorProps) {
  const [estaEditando, setEstaEditando] = useState(false);
  const [valorBorrador, setValorBorrador] = useState(temaActual);

  // Mantener sincronizado si el tema cambia externamente (ej. al reiniciar sesión)
  useEffect(() => {
    setValorBorrador(temaActual);
  }, [temaActual]);

  const handleGuardar = () => {
    // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
    // Si el usuario deja el campo con puros espacios en blanco, no debemos guardar
    // un string vacío porque la interfaz perderá contexto visual y el historial quedará sin título.
    const limpio = valorBorrador.trim();
    if (limpio.length > 0) {
      onActualizarTema(limpio);
    } else {
      setValorBorrador(temaActual);
    }
    setEstaEditando(false);
  };

  const handleSeleccionarSugerencia = (materia: string) => {
    onActualizarTema(materia);
    setValorBorrador(materia);
    setEstaEditando(false);
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 tracking-wide uppercase">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tema o Materia de la clase</span>
        </div>

        {!estaEditando && (
          <button
            type="button"
            onClick={() => setEstaEditando(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 p-1 -mr-1 rounded-md hover:bg-indigo-50/60 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Cambiar</span>
          </button>
        )}
      </div>

      {estaEditando ? (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={valorBorrador}
              onChange={(e) => setValorBorrador(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGuardar();
                }
              }}
              placeholder="Ej: Matemática - Ecuaciones o Historia"
              className="flex-1 text-sm font-semibold text-slate-900 border border-indigo-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-indigo-50/20"
              autoFocus
            />
            <button
              type="button"
              onClick={handleGuardar}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Listo</span>
            </button>
          </div>

          {/* Sugerencias rápidas para 1 toque */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 self-center mr-1">Rápidos:</span>
            {MATERIAS_SUGERIDAS.map((materia) => (
              <button
                key={materia}
                type="button"
                onClick={() => handleSeleccionarSugerencia(materia)}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-lg transition-colors font-medium"
              >
                {materia}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          onClick={() => setEstaEditando(true)}
          className="cursor-pointer group flex items-center justify-between"
        >
          <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {temaActual}
          </p>
          <span className="text-[11px] text-slate-400 group-hover:text-indigo-500 font-medium">
            Toca para editar
          </span>
        </div>
      )}
    </section>
  );
}
