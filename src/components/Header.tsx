import { useState } from 'react';
import { Activity, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReiniciar: () => void;
  onCargarDemo: () => void;
  totalVotos: number;
}

export function Header({ onReiniciar, onCargarDemo, totalVotos }: HeaderProps) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Marca y propósito principal */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              PULSO CLASE
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              Termómetro de comprensión
            </p>
          </div>
        </div>

        {/* Acciones de gestión para el docente */}
        <div className="flex items-center gap-1.5">
          {/* Botón para cargar datos de prueba rápidos si la clase está vacía */}
          {totalVotos === 0 && (
            <button
              onClick={onCargarDemo}
              title="Cargar 15 votos de ejemplo para probar el gráfico de barras"
              className="min-h-[38px] px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cargar ejemplo</span>
              <span className="xs:hidden">Demo</span>
            </button>
          )}

          {/* Botón para reiniciar la clase */}
          <button
            onClick={() => setMostrarConfirmacion(true)}
            title="Reiniciar pulso de la clase"
            disabled={totalVotos === 0}
            className={`min-h-[38px] min-w-[38px] p-2 rounded-lg text-slate-600 transition-colors flex items-center justify-center ${
              totalVotos === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'hover:bg-slate-100 hover:text-slate-900 active:scale-95'
            }`}
            aria-label="Reiniciar votos de la clase"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal accesible de confirmación para no borrar datos accidentalmente */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ¿Reiniciar el pulso de la clase?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Se restablecerá el gráfico a cero y se eliminarán los comentarios anónimos actuales.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMostrarConfirmacion(false)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onReiniciar();
                  setMostrarConfirmacion(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
