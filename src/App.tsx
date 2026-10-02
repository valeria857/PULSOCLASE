import { useState } from 'react';
import { Header } from './components/Header';
import { ExitQuestionCard } from './components/ExitQuestionCard';
import { VoteForm } from './components/VoteForm';
import { InteractiveBarChart } from './components/InteractiveBarChart';
import { AnonymousCommentsList } from './components/AnonymousCommentsList';
import {
  cargarSesion,
  guardarSesion,
  registrarVotoEnSesion,
  CONTEOS_INICIALES,
} from './utils/storage';
import { OpcionVoto, SesionClase } from './types';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  // ¡PUNTO CLAVE DONDE ALGUIEN SUELE EQUIVOCARSE!:
  // Usar la función de inicialización perezosa `useState(() => cargarSesion())`.
  // Si se ejecuta `useState(cargarSesion())`, se accedería a `localStorage` y se deserializaría
  // el JSON en CADA renderizado de React, ralentizando la aplicación en dispositivos móviles.
  const [sesion, setSesion] = useState<SesionClase>(() => cargarSesion());

  // Estado para el filtro interactivo del gráfico y la lista de comentarios
  const [filtroActivo, setFiltroActivo] = useState<OpcionVoto | 'Todos'>('Todos');

  // Acción 1 & 3: Registro inmediato de voto y comentario anónimo
  const handleEnviarVoto = (opcion: OpcionVoto, comentario?: string) => {
    // Registra el voto de manera inmutable y actualiza el gráfico al instante
    setSesion((prev) => registrarVotoEnSesion(prev, opcion, comentario));
  };

  // Acción 1: Modificar la pregunta de salida para la clase
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

  // Acción: Reiniciar el conteo para una nueva clase o tema
  const handleReiniciar = () => {
    setSesion((prev) => {
      const reiniciada: SesionClase = {
        ...prev,
        votos: [],
        conteos: { ...CONTEOS_INICIALES },
      };
      guardarSesion(reiniciada);
      return reiniciada;
    });
    setFiltroActivo('Todos');
  };

  // Acción: Cargar datos de prueba de una clase realista para validar el gráfico
  const handleCargarDemo = () => {
    const sesionDemo: SesionClase = {
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
      {/* Barra superior compacta con acciones */}
      <Header
        onReiniciar={handleReiniciar}
        onCargarDemo={handleCargarDemo}
        totalVotos={totalVotos}
      />

      {/* Contenedor principal optimizado para móviles (pantallas de 375px a 430px) y responsive */}
      <main className="w-full max-w-md mx-auto px-3.5 py-4 space-y-3.5 flex-1">
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

        {/* Función 3 (Visualización): Comentarios anónimos recibidos */}
        <AnonymousCommentsList
          votos={sesion.votos}
          filtroActivo={filtroActivo}
          onCambiarFiltro={setFiltroActivo}
        />

        {/* Nota pedagógica y de privacidad */}
        <footer className="pt-2 pb-6 text-center text-slate-400 text-[11px] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>PULSO CLASE · Sin registros personales ni cuentas obligatorias</span>
        </footer>
      </main>
    </div>
  );
}
