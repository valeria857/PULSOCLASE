import { useState } from 'react';
import { Header } from './components/Header';
import { ClassTopicSelector } from './components/ClassTopicSelector';
import { ExitQuestionCard } from './components/ExitQuestionCard';
import { VoteForm } from './components/VoteForm';
import { InteractiveBarChart } from './components/InteractiveBarChart';
import { AnonymousCommentsList } from './components/AnonymousCommentsList';
import {
  cargarSesion,
  guardarSesion,
  registrarVotoEnSesion,
  guardarSesionEnHistorial,
  cargarHistorial,
  CONTEOS_INICIALES,
} from './utils/storage';
import { OpcionVoto, SesionClase } from './types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Inicialización perezosa de la sesión actual y del historial archivado
  const [sesion, setSesion] = useState<SesionClase>(() => cargarSesion());
  const [historial, setHistorial] = useState<SesionClase[]>(() => cargarHistorial());

  // Estado para el filtro interactivo del gráfico y la lista de comentarios
  const [filtroActivo, setFiltroActivo] = useState<OpcionVoto | 'Todos'>('Todos');
  const [mensajeNuevaSesion, setMensajeNuevaSesion] = useState(false);

  // Registro inmediato de voto y comentario anónimo
  const handleEnviarVoto = (opcion: OpcionVoto, comentario?: string) => {
    setSesion((prev) => registrarVotoEnSesion(prev, opcion, comentario));
  };

  // Función 1: Actualizar el Tema o Materia de la clase actual
  const handleActualizarTema = (nuevoTema: string) => {
    setSesion((prev) => {
      const actualizada: SesionClase = {
        ...prev,
        tema: nuevoTema,
      };
      guardarSesion(actualizada);
      return actualizada;
    });
  };

  // Actualizar la pregunta de salida para la clase
  const handleActualizarPregunta = (nuevaPregunta: string) => {
    setSesion((prev) => {
      const actualizada: SesionClase = {
        ...prev,
        pregunta: nuevaPregunta,
      };
      guardarSesion(actualizada);
      return actualizada;
    });
  };

  // Función 2: 'Iniciar Nueva Sesión / Reiniciar Votos' guardando la sesión anterior
  const handleIniciarNuevaSesion = () => {
    // 1. Guardamos la sesión anterior en el historial si tenía votos o comentarios
    guardarSesionEnHistorial(sesion);
    setHistorial(cargarHistorial());

    // 2. Limpiamos el gráfico de barras y los comentarios en pantalla, conservando el tema y pregunta
    setSesion((prev) => {
      const nuevaSesion: SesionClase = {
        ...prev,
        votos: [],
        conteos: { ...CONTEOS_INICIALES },
        creadaEn: new Date().toISOString(),
      };
      guardarSesion(nuevaSesion);
      return nuevaSesion;
    });

    setFiltroActivo('Todos');
    setMensajeNuevaSesion(true);
    setTimeout(() => setMensajeNuevaSesion(false), 3500);
  };

  // Acción: Cargar datos de prueba de una clase realista para validar el gráfico
  const handleCargarDemo = () => {
    const sesionDemo: SesionClase = {
      tema: sesion.tema || 'Matemática - Derivadas y Funciones',
      pregunta: sesion.pregunta,
      creadaEn: new Date().toISOString(),
      conteos: {
        'Entendí': 11,
        'Tengo dudas': 6,
        'Me perdí': 3,
      },
      votos: [
        {
          id: 'v_demo_1',
          opcion: 'Me perdí',
          comentario: 'No entendí cuándo se aplica el signo negativo en la fórmula del paso 3.',
          fechaHora: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        },
        {
          id: 'v_demo_2',
          opcion: 'Tengo dudas',
          comentario: 'El primer ejemplo quedó claro, pero en el segundo me confundí con las unidades.',
          fechaHora: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: 'v_demo_3',
          opcion: 'Tengo dudas',
          comentario: '¿Podemos hacer un ejercicio más similar al de la guía práctica?',
          fechaHora: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        },
        {
          id: 'v_demo_4',
          opcion: 'Entendí',
          comentario: 'Excelente explicación con la analogía del pizarrón.',
          fechaHora: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
        {
          id: 'v_demo_5',
          opcion: 'Me perdí',
          comentario: 'Me quedé en la parte teórica del inicio, ¿dónde puedo leer más?',
          fechaHora: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        },
      ],
    };

    setSesion(sesionDemo);
    guardarSesion(sesionDemo);
  };

  const totalVotos =
    sesion.conteos['Entendí'] +
    sesion.conteos['Tengo dudas'] +
    sesion.conteos['Me perdí'];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Barra superior con botón 'Iniciar Nueva Sesión / Reiniciar Votos' y acceso al historial */}
      <Header
        onIniciarNuevaSesion={handleIniciarNuevaSesion}
        onCargarDemo={handleCargarDemo}
        totalVotos={totalVotos}
        historial={historial}
      />

      {/* Contenedor principal responsive */}
      <main className="w-full max-w-md mx-auto px-3.5 py-4 space-y-3.5 flex-1">
        {/* Notificación suave al guardar sesión anterior e iniciar nueva */}
        {mensajeNuevaSesion && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>¡Sesión anterior guardada con éxito en el historial! Gráfico listo para la nueva clase.</span>
          </div>
        )}

        {/* Función complementaria 1: Selector / campo para ingresar Tema o Materia de la clase */}
        <ClassTopicSelector
          temaActual={sesion.tema}
          onActualizarTema={handleActualizarTema}
        />

        {/* Función 1: Registrar y visualizar la pregunta de salida */}
        <ExitQuestionCard
          pregunta={sesion.pregunta}
          onActualizarPregunta={handleActualizarPregunta}
        />

        {/* Función 1 & 3: Botones de voto ('Entendí', 'Tengo dudas', 'Me perdí') y comentario anónimo */}
        <VoteForm onEnviarVoto={handleEnviarVoto} />

        {/* Función 2: Resumen visual de la clase con gráfico de barras interactivo animado */}
        <InteractiveBarChart
          conteos={sesion.conteos}
          filtroActivo={filtroActivo}
          onSeleccionarFiltro={setFiltroActivo}
        />

        {/* Función 3: Comentarios anónimos recibidos */}
        <AnonymousCommentsList
          votos={sesion.votos}
          filtroActivo={filtroActivo}
          onCambiarFiltro={setFiltroActivo}
        />

        {/* Pie informativo */}
        <footer className="pt-2 pb-6 text-center text-slate-400 text-[11px] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>PULSO CLASE · Sin registros personales ni cuentas obligatorias</span>
        </footer>
      </main>
    </div>
  );
}
