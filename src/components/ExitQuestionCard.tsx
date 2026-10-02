import { useState } from 'react';
import { HelpCircle, Edit3, Check, X } from 'lucide-react';

interface ExitQuestionCardProps {
  pregunta: string;
  onActualizarPregunta: (nuevaPregunta: string) => void;
}

export function ExitQuestionCard({ pregunta, onActualizarPregunta }: ExitQuestionCardProps) {
  const [estaEditando, setEstaEditando] = useState(false);
  const [textoBorrador, setTextoBorrador] = useState(pregunta);

  const iniciarEdicion = () => {
    setTextoBorrador(pregunta);
    setEstaEditando(true);
  };

  const guardarCambio = () => {
    // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
    // Permitir guardar una pregunta vacía o con solo espacios rompe el propósito pedagógico
    // de la salida de clase. Si el usuario borra todo, conservamos la pregunta previa o exigimos contenido.
    const preguntaLimpia = textoBorrador.trim();
    if (preguntaLimpia.length > 0) {
      onActualizarPregunta(preguntaLimpia);
    }
    setEstaEditando(false);
  };

  const cancelar = () => {
    setTextoBorrador(pregunta);
    setEstaEditando(false);
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Pregunta de Salida</span>
        </div>

        {!estaEditando && (
          <button
            onClick={iniciarEdicion}
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 p-1 -mr-1 rounded-md hover:bg-indigo-50/60 transition-colors"
            title="Cambiar la pregunta de la clase"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
        )}
      </div>

      {estaEditando ? (
        <div className="space-y-2.5">
          <label htmlFor="input-pregunta-salida" className="sr-only">
            Editar pregunta de salida de la clase
          </label>
          <textarea
            id="input-pregunta-salida"
            value={textoBorrador}
            onChange={(e) => setTextoBorrador(e.target.value)}
            rows={2}
            autoFocus
            className="w-full text-sm font-semibold text-slate-900 border border-indigo-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-indigo-50/20 resize-none"
            placeholder="Escribe la pregunta de salida para tu clase..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelar}
              className="py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={guardarCambio}
              disabled={textoBorrador.trim().length === 0}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          "{pregunta}"
        </p>
      )}
    </section>
  );
}
