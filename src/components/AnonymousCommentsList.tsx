import { useMemo } from 'react';
import { MessageSquare, Clock, Filter } from 'lucide-react';
import { OpcionVoto, VotoRegistro } from '../types';

interface AnonymousCommentsListProps {
  votos: VotoRegistro[];
  filtroActivo: OpcionVoto | 'Todos';
  onCambiarFiltro: (filtro: OpcionVoto | 'Todos') => void;
}

export function AnonymousCommentsList({
  votos,
  filtroActivo,
  onCambiarFiltro,
}: AnonymousCommentsListProps) {
  // Extraemos únicamente los votos que tienen un comentario con texto
  const comentariosConTexto = useMemo(() => {
    return votos.filter(
      (v) => typeof v.comentario === 'string' && v.comentario.trim().length > 0
    );
  }, [votos]);

  // Filtramos según la opción seleccionada por el usuario en el gráfico de barras o botones
  const comentariosFiltrados = useMemo(() => {
    if (filtroActivo === 'Todos') {
      return comentariosConTexto;
    }
    return comentariosConTexto.filter((c) => c.opcion === filtroActivo);
  }, [comentariosConTexto, filtroActivo]);

  // Formato amigable de hora
  const formatearHora = (isoString: string): string => {
    try {
      const fecha = new Date(isoString);
      return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Reciente';
    }
  };

  const badgeColorPorOpcion: Record<OpcionVoto, string> = {
    'Entendí': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Tengo dudas': 'bg-amber-50 text-amber-700 border-amber-200',
    'Me perdí': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              Comentarios anónimos
            </h2>
            <p className="text-[11px] text-slate-400">
              {comentariosConTexto.length} {comentariosConTexto.length === 1 ? 'comentario' : 'comentarios'} de alumnos
            </p>
          </div>
        </div>

        {/* Filtros rápidos */}
        {comentariosConTexto.length > 0 && (
          <div className="flex items-center gap-1 text-[11px]">
            <Filter className="w-3 h-3 text-slate-400 mr-0.5" />
            <button
              type="button"
              onClick={() => onCambiarFiltro('Todos')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filtroActivo === 'Todos'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => onCambiarFiltro('Tengo dudas')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filtroActivo === 'Tengo dudas'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dudas
            </button>
            <button
              type="button"
              onClick={() => onCambiarFiltro('Me perdí')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filtroActivo === 'Me perdí'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Perdidos
            </button>
          </div>
        )}
      </div>

      {/* Lista de comentarios */}
      {comentariosFiltrados.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          {comentariosConTexto.length === 0
            ? 'Aún no hay comentarios anónimos enviados para esta clase.'
            : `No hay comentarios en la categoría "${filtroActivo}".`}
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {comentariosFiltrados.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition-all text-left space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold border ${
                    badgeColorPorOpcion[item.opcion]
                  }`}
                >
                  {item.opcion}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-mono-numbers">
                  <Clock className="w-3 h-3" />
                  {formatearHora(item.fechaHora)}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                "{item.comentario}"
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
