import { useState, useMemo } from "react";
import EditableCell from "./EditableCell";
import { api } from "@/hooks/useApi";
import { Actividad, AlumnoNotas } from "@/Modules/notas/EvaluacionesPage";
import React from "react";

interface Props {
  actividades: Actividad[];
  alumnos: AlumnoNotas[];
  onNotaGuardada: () => void;
  onAgregarActividad: (dim: Props["actividades"][number]["dimension"]) => void;
  cursoId: number;
  materiaId: number;
  trimestre: string;
  setActividades: React.Dispatch<React.SetStateAction<Actividad[]>>;
}

export default function TablaEvaluaciones({ actividades, alumnos, onNotaGuardada, onAgregarActividad, cursoId, materiaId, trimestre, setActividades }: Props) {
  const dimensiones = ["ser", "saber", "hacer", "decidir"] as const;
  // const ponderaciones: Record<string, number> = { ser: 5, saber: 45, hacer: 40, decidir: 5 };

  const [renderKey, setRenderKey] = useState(0);
  const porDim = useMemo(() => {
    const agrupadas: Record<string, Actividad[]> = {
      ser: [], saber: [], hacer: [], decidir: [],
    };
    actividades.forEach((a) => agrupadas[a.dimension].push(a));
    return agrupadas;
  }, [actividades]);

  const calcularPromedioDimension = (al: AlumnoNotas, acts: Actividad[]) => {
    if (acts.length === 0) return 0;
    const suma = acts.reduce((acc, act) => acc + (al.notas[act.id.toString()] ?? 0), 0);
    return suma / acts.length;
  };

  // const calcularNotaFinal = (al: AlumnoNotas) => {
  //   let total = 0;
  //   for (const dim of dimensiones) {
  //     const promedio = calcularPromedioDimension(al, porDim[dim]);
  //     total += promedio * (ponderaciones[dim] / 100);
  //   }
  //   total += al.autoevaluacion ?? 0;
  //   return total;
  // };
  const calcularNotaFinal = (al: AlumnoNotas) => {
    let total = 0;
    for (const dim of dimensiones) {
      total += calcularPromedioDimension(al, porDim[dim]);
    }
    total += al.autoevaluacion ?? 0;
    return total;
  };
  

  const getColorClass = (total: number) => {
    if (total < 51) return "text-red-600 font-bold";
    if (total < 70) return "text-yellow-600 font-semibold";
    if (total < 90) return "text-blue-700 font-semibold";
    return "text-green-700 font-bold";
  };

  const [editando, setEditando] = useState<number | null>(null);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");

  const eliminarActividad = async (id: number) => {
    if (!confirm("¿Eliminar esta actividad? Se eliminarán también todas las notas asociadas.")) return;
    await api("DELETE", `/notas/actividades/${id}/`);
    setActividades((prev) => prev.filter((a) => a.id !== id));
    setRenderKey((k) => k + 1);
  };

  const guardarDescripcion = async (id: number) => {
    if (!nuevoTexto.trim()) return;
    await api("PATCH", `/notas/actividades/${id}/`, { descripcion: nuevoTexto });
    setEditando(null);
    setNuevoTexto("");
    onNotaGuardada();
  };

  return (
    <table key={renderKey} className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1">Alumno</th>
          {dimensiones.map((d) => (
            <th key={d} colSpan={porDim[d].length + 1} className="border px-2 py-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <span>{d.toUpperCase()}</span>
                <button onClick={() => onAgregarActividad(d)} className="leading-none">＋</button>
              </div>
            </th>
          ))}
          <th className="border px-2 py-1">Autoeval.</th>
          <th className="border px-2 py-1">Total Final</th>
        </tr>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1" />
          {dimensiones.map((d) => (
            <React.Fragment key={`cab-${d}`}>
              {porDim[d].map((act) => (
                <th key={act.id} className="border px-2 py-1 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {editando === act.id ? (
                      <input
                        type="text"
                        value={nuevoTexto}
                        onChange={(e) => setNuevoTexto(e.target.value)}
                        onBlur={() => guardarDescripcion(act.id)}
                        onKeyDown={(e) => e.key === "Enter" && guardarDescripcion(act.id)}
                        className="w-full px-1 text-sm border rounded bg-white text-black"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => {
                          setEditando(act.id);
                          setNuevoTexto(act.descripcion);
                        }}
                        className="cursor-pointer"
                      >
                        {act.descripcion}
                      </span>
                    )}
                    <button onClick={() => eliminarActividad(act.id)} className="text-red-500 ml-1">✕</button>
                  </div>
                </th>
              ))}
              <th key={`prom-label-${d}`} className="border px-2 py-1">Nota {d.toUpperCase()}</th>
            </React.Fragment>
          ))}
          <th className="border px-2 py-1" />
          <th className="border px-2 py-1" />
        </tr>
      </thead>
      <tbody>
        {alumnos.map((al) => {
          const notaFinal = calcularNotaFinal(al);
          return (
            <tr key={al.alumno}>
              <td className="border px-2 py-1 font-semibold whitespace-nowrap">{al.alumno_nombre}</td>
              {dimensiones.map((d) => (
                <React.Fragment key={`${al.alumno}-${d}`}>
                  {porDim[d].map((act) => (
                    <td key={`nota-${al.alumno}-${act.id}`} className="border px-1 py-0.5 text-center">
                      <EditableCell
                        alumnoId={al.alumno}
                        actividadId={act.id}
                        notaInicial={al.notas[act.id.toString()]}
                        onSaved={onNotaGuardada}
                        cursoId={cursoId}
                        materiaId={materiaId}
                        trimestre={trimestre}
                      />
                    </td>
                  ))}
                  <td key={`prom-${al.alumno}-${d}`} className="border px-1 py-0.5 text-center font-semibold text-blue-700">
                    {calcularPromedioDimension(al, porDim[d]).toFixed(1)}
                  </td>
                </React.Fragment>
              ))}
              <td className="border px-1 py-0.5 text-center">
                <EditableCell
                  alumnoId={al.alumno}
                  actividadId={-1}
                  notaInicial={al.autoevaluacion}
                  onSaved={onNotaGuardada}
                  cursoId={cursoId}
                  materiaId={materiaId}
                  trimestre={trimestre}
                />
              </td>
              <td className={`border px-1 py-0.5 text-center ${getColorClass(notaFinal)}`}>
                {notaFinal.toFixed(1)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
