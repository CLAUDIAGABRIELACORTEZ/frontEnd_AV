
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import TablaEvaluaciones from "./TablaEvaluaciones";
// import ModalNuevaActividad from "./ModalNuevaActividas";
// import { api } from "@/hooks/useApi";
// import { Button } from "@/components/ui/button";

// export interface Actividad {
//   id: number;
//   descripcion: string;
//   dimension: "ser" | "saber" | "hacer" | "decidir";
// }
// export interface AlumnoNotas {
//   alumno: number;
//   alumno_nombre: string;
//   notas: Record<string, number>;
//   autoevaluacion?: number;
// }

// const TRIMESTRES = ["1er Trimestre", "2do Trimestre", "3er Trimestre"];

// export default function EvaluacionesPage() {
//   const { cursoId, materiaId } = useParams();
//   const [actividades, setActividades] = useState<Actividad[]>([]);
//   const [alumnos, setAlumnos] = useState<AlumnoNotas[]>([]);
//   const [showModal, setShowModal] = useState<false | "ser" | "saber" | "hacer" | "decidir" >(false);
//   const [trimestre, setTrimestre] = useState<string>(TRIMESTRES[0]);

//   const fetchData = async () => {
//     if (!cursoId || !materiaId) return;
//     const [activs, alumnosData] = await Promise.all([
//       api<Actividad[]>("GET", `/notas/actividades/?curso=${cursoId}&materia=${materiaId}&trimestre=${trimestre}`),
//       api<AlumnoNotas[]>("GET", `/notas/cuadricula/?curso=${cursoId}&materia=${materiaId}&trimestre=${trimestre}`),
//     ]);
//     setActividades(activs);
//     setAlumnos(alumnosData);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [cursoId, materiaId, trimestre]);

//   return (
//     <div className="p-6 overflow-auto space-y-4">
//       {/* Selector de trimestre */}
//       <div className="flex gap-2 mb-4">
//         {TRIMESTRES.map((t) => (
//           <button
//             key={t}
//             className={`px-4 py-2 rounded ${
//               trimestre === t ? "bg-primary text-white" : "bg-gray-200"
//             }`}
//             onClick={() => setTrimestre(t)}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold">Evaluaciones</h2>
//       </div>

//       {/* Tabla */}
//       <TablaEvaluaciones
//         actividades={actividades}
//         alumnos={alumnos}
//         onNotaGuardada={() => fetchData()}
//         onAgregarActividad={(dim) => setShowModal(dim)}
//         cursoId={Number(cursoId)}          // ✅ Nuevo
//         materiaId={Number(materiaId)}      // ✅ Nuevo
//         trimestre={trimestre}              // ✅ Nuevo
//       />


//       {/* Modal nueva actividad */}
//       {showModal && (
//         <ModalNuevaActividad
//           dim={showModal}
//           cursoId={Number(cursoId)}
//           materiaId={Number(materiaId)}
//           trimestre={trimestre}
//           close={() => setShowModal(false)}
//           refetch={fetchData}
//         />
//       )}
//     </div>
//   );
// }
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TablaEvaluaciones from "./TablaEvaluaciones";
import ModalNuevaActividad from "./ModalNuevaActividas";
import { api } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";

export interface Actividad {
  id: number;
  descripcion: string;
  dimension: "ser" | "saber" | "hacer" | "decidir";
}
export interface AlumnoNotas {
  alumno: number;
  alumno_nombre: string;
  notas: Record<string, number>; // key = actividadId
  autoevaluacion?: number;
}

export default function EvaluacionesPage() {
  const { cursoId, materiaId } = useParams();
  const [trimestre, setTrimestre] = useState("1er Trimestre");
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [alumnos, setAlumnos] = useState<AlumnoNotas[]>([]);
  const [showModal, setShowModal] = useState<false | "ser" | "saber" | "hacer" | "decidir">(false);

  const fetchData = async () => {
    if (!cursoId || !materiaId || !trimestre) return;
    const [activs, alumnosData] = await Promise.all([
      api<Actividad[]>("GET", `/notas/actividades/?curso=${cursoId}&materia=${materiaId}&trimestre=${trimestre}`),
      api<AlumnoNotas[]>("GET", `/notas/cuadricula/?curso=${cursoId}&materia=${materiaId}&trimestre=${trimestre}`),
    ]);
    setActividades(activs);
    setAlumnos(alumnosData);
  };

  useEffect(() => {
    fetchData();
  }, [cursoId, materiaId, trimestre]);

  const trimestres = ["1er Trimestre", "2do Trimestre", "3er Trimestre"];

  return (
    <div className="p-6 overflow-auto space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {trimestres.map((t) => (
          <Button
            key={t}
            variant={trimestre === t ? "default" : "outline"}
            onClick={() => setTrimestre(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <h2 className="text-2xl font-bold">Evaluaciones</h2>

      <TablaEvaluaciones
        actividades={actividades}
        alumnos={alumnos}
        onNotaGuardada={fetchData}
        onAgregarActividad={(dim) => setShowModal(dim)}
        cursoId={Number(cursoId)}
        materiaId={Number(materiaId)}
        trimestre={trimestre}
        setActividades={setActividades}
      />

      {showModal && (
        <ModalNuevaActividad
          dim={showModal}
          cursoId={Number(cursoId)}
          materiaId={Number(materiaId)}
          close={() => setShowModal(false)}
          refetch={fetchData}
          trimestre={trimestre}
        />
      )}
    </div>
  );
}
