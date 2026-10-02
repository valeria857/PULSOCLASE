import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, AlertCircle, Send, MessageSquareQuote } from 'lucide-react';
import { OpcionVoto } from '../types';

interface VoteFormProps {
  onEnviarVoto: (opcion: OpcionVoto, comentario?: string) => void;
}

export function VoteForm({ onEnviarVoto }: VoteFormProps) {
  // Estado local para la opción seleccionada y el comentario anónimo opcional
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionVoto | null>(null);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Configuración de las 3 opciones requeridas con colores accesibles e intuitivos
  const opciones: Array<{
    id: OpcionVoto;
    titulo: string;
    descripcion: string;
    icono: React.ElementType;
    colorBordeActivo: string;
    colorFondoActivo: string;
    colorTextoActivo: string;
    colorIcono: string;
  }> = [
    {
      id: 'Entendí',
      titulo: 'Entendí',
      descripcion: 'Puedo avanzar o explicarlo',
      icono: CheckCircle2,
      colorBordeActivo: 'border-emerald-500 bg-emerald-50/70',
      colorFondoActivo: 'ring-2 ring-emerald-500',
      colorTextoActivo: 'text-emerald-800',
      colorIcono: 'text-emerald-600',
    },
    {
      id: 'Tengo dudas',
      titulo: 'Tengo dudas',
      descripcion: 'Entendí parte, pero me trabo',
      icono: HelpCircle,
      colorBordeActivo: 'border-amber-500 bg-amber-50/70',
      colorFondoActivo: 'ring-2 ring-amber-500',
      colorTextoActivo: 'text-amber-800',
      colorIcono: 'text-amber-600',
    },
    {
      id: 'Me perdí',
      titulo: 'Me perdí',
      descripcion: 'Necesito repasar la base',
      icono: AlertCircle,
      colorBordeActivo: 'border-rose-500 bg-rose-50/70',
      colorFondoActivo: 'ring-2 ring-rose-500',
      colorTextoActivo: 'text-rose-800',
      colorIcono: 'text-rose-600',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
    // 1. Olvidar `e.preventDefault()` recargará toda la página en dispositivos móviles,
    //    perdiendo el estado en memoria y provocando una mala experiencia de usuario.
    e.preventDefault();

    // 2. Intentar enviar sin haber seleccionado una opción:
    //    Siempre se debe validar en el cliente que `opcionSeleccionada` no sea nulo.
    if (!opcionSeleccionada) {
      return;
    }

    setEnviando(true);

    // Ejecutamos el registro de voto de forma inmediata
    onEnviarVoto(opcionSeleccionada, comentario);

    // Animación suave de confirmación
    setMensajeExito(true);

    // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
    // Limpiar el formulario luego de enviar para permitir que otro estudiante
    // en el mismo dispositivo pueda votar o para evitar envíos duplicados continuos.
    setOpcionSeleccionada(null);
    setComentario('');
    setEnviando(false);

    // Ocultar mensaje de confirmación después de unos segundos
    setTimeout(() => {
      setMensajeExito(false);
    }, 2800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span>¿Cómo te sentiste con el contenido de hoy?</span>
        </h2>
        <span className="text-[11px] text-slate-400 font-medium">Elige una opción</span>
      </div>

      {/* Selector con las 3 opciones de voto */}
      <div className="grid grid-cols-1 gap-2.5">
        {opciones.map((op) => {
          const Icono = op.icono;
          const estaActivo = opcionSeleccionada === op.id;

          return (
            <button
              key={op.id}
              type="button"
              onClick={() => setOpcionSeleccionada(op.id)}
              className={`min-h-[58px] w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between active:scale-[0.99] cursor-pointer ${
                estaActivo
                  ? `${op.colorBordeActivo} ${op.colorFondoActivo} shadow-xs`
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
              }`}
              aria-pressed={estaActivo}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    estaActivo ? 'bg-white shadow-xs' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icono className={`w-5 h-5 ${estaActivo ? op.colorIcono : 'text-slate-500'}`} />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold leading-tight ${
                      estaActivo ? op.colorTextoActivo : 'text-slate-800'
                    }`}
                  >
                    {op.titulo}
                  </div>
                  <div className="text-xs text-slate-500 leading-tight mt-0.5">
                    {op.descripcion}
                  </div>
                </div>
              </div>

              {/* Indicador radial visible */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  estaActivo
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {estaActivo && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Comentario anónimo opcional (Requerimiento 3) */}
      <div className="pt-1">
        <label
          htmlFor="comentario-anonimo"
          className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5 text-slate-400" />
            <span>Comentario anónimo (opcional)</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {comentario.length}/200
          </span>
        </label>
        <textarea
          id="comentario-anonimo"
          value={comentario}
          onChange={(e) => setComentario(e.target.value.slice(0, 200))}
          placeholder="Ej: ¿Qué parte te costó más? o ¿qué ejemplo te ayudó a entender?"
          rows={2}
          className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50/80 border border-slate-200 rounded-xl p-3 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
        />
        <p className="text-[11px] text-slate-400 mt-1 leading-normal">
          🔒 100% anónimo: Tu docente no verá tu nombre, solo tus observaciones para mejorar la clase.
        </p>
      </div>

      {/* Botón de envío táctil optimizado para celular */}
      <button
        type="submit"
        disabled={!opcionSeleccionada || enviando}
        className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
          opcionSeleccionada
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 cursor-pointer'
            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
        }`}
      >
        <Send className="w-4 h-4" />
        <span>Enviar mi voto</span>
      </button>

      {/* Mensaje de confirmación suave */}
      {mensajeExito && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Gracias! Tu voto y comentario anónimo se registraron en el pulso de la clase.</span>
        </div>
      )}
    </form>
  );
}
