import { useMemo } from 'react';
import { BarChart3, Users, Sparkles } from 'lucide-react';
import { ConteoVotos, OpcionVoto } from '../types';

interface InteractiveBarChartProps {
  conteos: ConteoVotos;
  filtroActivo: OpcionVoto | 'Todos';
  onSeleccionarFiltro: (filtro: OpcionVoto | 'Todos') => void;
}

export function InteractiveBarChart({
  conteos,
  filtroActivo,
  onSeleccionarFiltro,
}: InteractiveBarChartProps) {
  // Cálculo memoizado del total de votos
  const totalVotos = useMemo(() => {
    return conteos['Entendí'] + conteos['Tengo dudas'] + conteos['Me perdí'];
  }, [conteos]);

  // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
  // Al calcular porcentajes, si totalVotos es 0, `(votos / totalVotos) * 100` resulta en NaN.
  // Si se inyecta NaN en estilos CSS (`style={{ width: 'NaN%' }}`), el navegador ignora el ancho
  // o lanza inconsistencias visuales. Siempre se debe verificar que totalVotos > 0.
  const calcularPorcentaje = (votos: number): number => {
    if (totalVotos <= 0) return 0;
    return Math.round((votos / totalVotos) * 100);
  };

  const datosBarras: Array<{
    id: OpcionVoto;
    etiqueta: string;
    votos: number;
    porcentaje: number;
    colorBarra: string;
    colorTexto: string;
    colorBorde: string;
    colorFondoTag: string;
  }> = [
    {
      id: 'Entendí',
      etiqueta: 'Entendí',
      votos: conteos['Entendí'],
      porcentaje: calcularPorcentaje(conteos['Entendí']),
      colorBarra: 'bg-emerald-500',
      colorTexto: 'text-emerald-700',
      colorBorde: 'border-emerald-200',
      colorFondoTag: 'bg-emerald-50',
    },
    {
      id: 'Tengo dudas',
      etiqueta: 'Tengo dudas',
      votos: conteos['Tengo dudas'],
      porcentaje: calcularPorcentaje(conteos['Tengo dudas']),
      colorBarra: 'bg-amber-500',
      colorTexto: 'text-amber-700',
      colorBorde: 'border-amber-200',
      colorFondoTag: 'bg-amber-50',
    },
    {
      id: 'Me perdí',
      etiqueta: 'Me perdí',
      votos: conteos['Me perdí'],
      porcentaje: calcularPorcentaje(conteos['Me perdí']),
      colorBarra: 'bg-rose-500',
      colorTexto: 'text-rose-700',
      colorBorde: 'border-rose-200',
      colorFondoTag: 'bg-rose-50',
    },
  ];

  // Diagnóstico pedagógico rápido para el docente
  const diagnosticoDocente = useMemo(() => {
    if (totalVotos === 0) {
      return 'Esperando las primeras respuestas de la clase...';
    }
    const porcentajeAtencion = calcularPorcentaje(
      conteos['Tengo dudas'] + conteos['Me perdí']
    );

    if (conteos['Me perdí'] > 0 && conteos['Me perdí'] >= conteos['Entendí']) {
      return `⚠️ Alerta: El ${porcentajeAtencion}% de la clase tiene dudas o se perdió. Conviene pausar y repasar antes del examen.`;
    }
    if (conteos['Tengo dudas'] > conteos['Entendí']) {
      return `🔍 Se detectaron dudas puntuales (${conteos['Tengo dudas']} alumnos). Revisa los comentarios abajo para aclararlas.`;
    }
    if (calcularPorcentaje(conteos['Entendí']) >= 75) {
      return `🎉 ¡Excelente comprensión! El ${calcularPorcentaje(conteos['Entendí'])}% de los alumnos entendió el tema.`;
    }
    return `📊 Pulso actual: ${conteos['Entendí']} entendieron, ${conteos['Tengo dudas']} con dudas y ${conteos['Me perdí']} necesitan apoyo.`;
  }, [conteos, totalVotos]);

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
      {/* Encabezado del gráfico */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              Resumen visual de la clase
            </h2>
            <p className="text-[11px] text-slate-400">
              Toca una barra para filtrar comentarios
            </p>
          </div>
        </div>

        {/* Contador total de respuestas */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono-numbers">{totalVotos}</span>
          <span>{totalVotos === 1 ? 'voto' : 'votos'}</span>
        </div>
      </div>

      {/* Gráfico de barras interactivo con transiciones animadas */}
      <div className="space-y-3.5 pt-1">
        {datosBarras.map((barra) => {
          const estaFiltrado = filtroActivo === barra.id;

          return (
            <div
              key={barra.id}
              onClick={() =>
                onSeleccionarFiltro(estaFiltrado ? 'Todos' : barra.id)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSeleccionarFiltro(estaFiltrado ? 'Todos' : barra.id);
                }
              }}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
                estaFiltrado
                  ? `border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-400`
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              {/* Encabezado de la barra: Etiqueta, Votos y Porcentaje */}
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  {barra.etiqueta}
                  {estaFiltrado && (
                    <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-100/70 px-1.5 py-0.2 rounded">
                      filtrado
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono-numbers font-semibold text-slate-700">
                    {barra.votos} {barra.votos === 1 ? 'voto' : 'votos'}
                  </span>
                  <span
                    className={`font-mono-numbers font-bold text-xs px-2 py-0.5 rounded-md ${barra.colorFondoTag} ${barra.colorTexto}`}
                  >
                    {barra.porcentaje}%
                  </span>
                </div>
              </div>

              {/* Riel de la barra con animación CSS suave */}
              <div
                className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden relative"
                role="progressbar"
                aria-valuenow={barra.porcentaje}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${barra.etiqueta}: ${barra.votos} votos (${barra.porcentaje}%)`}
              >
                <div
                  className={`h-full rounded-full ${barra.colorBarra} transition-all duration-700 ease-out`}
                  style={{
                    // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
                    // Asegurarse de que el ancho esté contenido entre 0% y 100% y que nunca sea NaN
                    width: `${Math.min(100, Math.max(0, barra.porcentaje))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tarjeta de diagnóstico para el docente */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">{diagnosticoDocente}</p>
      </div>
    </section>
  );
}
