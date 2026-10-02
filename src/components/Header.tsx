import { useState } from 'react';
import { Activity, PlusCircle, Sparkles, History, X, CheckCircle2 } from 'lucide-react';
import { SesionClase } from '../types';

interface HeaderProps {
  onIniciarNuevaSesion: () => void;
  onCargarDemo: () => void;
  totalVotos: number;
  historial: SesionClase[];
}

export function Header({
  onIniciarNuevaSesion,
  onCargarDemo,
  totalVotos,
  historial,
}: HeaderProps) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarHistorialModal, setMostrarHistorialModal] = useState(false);

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
              title="Cargar votos de ejemplo para probar"
              className="min-h-[38px] px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cargar ejemplo</span>
              <span className="xs:hidden">Demo</span>
            </button>
          )}

          {/* Botón para ver historial de sesiones guardadas */}
          {historial.length > 0 && (
            <button
              onClick={() => setMostrarHistorialModal(true)}
              title="Ver sesiones guardadas anteriormente"
              className="min-h-[38px] px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold">{historial.length}</span>
            </button>
          )}

          {/* Botón principal: Iniciar Nueva Sesión / Reiniciar Votos (Requerimiento 2) */}
          <button
            onClick={() => setMostrarConfirmacion(true)}
            title="Iniciar Nueva Sesión / Reiniciar Votos (Guarda la sesión actual)"
            className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            aria-label="Iniciar Nueva Sesión / Reiniciar Votos"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva sesión</span>
          </button>
        </div>
      </div>

      {/* Modal de confirmación para 'Iniciar Nueva Sesión / Reiniciar Votos' */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ¿Iniciar Nueva Sesión / Reiniciar Votos?
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Se limpiará el gráfico y los comentarios en pantalla para una nueva clase.
              {totalVotos > 0 ? (
                <span className="block mt-1 font-semibold text-emerald-700">
                  ✓ Los {totalVotos} votos de la sesión actual quedarán guardados en el historial.
                </span>
              ) : (
                <span className="block mt-1 text-slate-400">
                  (La pantalla actual no tiene votos registrados todavía).
                </span>
              )}
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
                  onIniciarNuevaSesion();
                  setMostrarConfirmacion(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-xs"
              >
                Sí, iniciar nueva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial de Sesiones Guardadas */}
      {mostrarHistorialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border border-slate-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Sesiones Guardadas ({historial.length})
                </h3>
              </div>
              <button
                onClick={() => setMostrarHistorialModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-left">
              {historial.map((ses, idx) => {
                const total =
                  ses.conteos['Entendí'] +
                  ses.conteos['Tengo dudas'] +
                  ses.conteos['Me perdí'];

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {ses.tema || 'Clase'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono-numbers">
                        {new Date(ses.creadaEn).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 italic">
                      "{ses.pregunta}"
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                        {ses.conteos['Entendí']} Entendí
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                        {ses.conteos['Tengo dudas']} Dudas
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium">
                        {ses.conteos['Me perdí']} Perdidos
                      </span>
                      <span className="ml-auto text-slate-400 font-mono-numbers font-semibold">
                        Total: {total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setMostrarHistorialModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cerrar historial
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
