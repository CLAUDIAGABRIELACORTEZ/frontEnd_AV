import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AppConfig } from "@/config/app-config";
import { toast } from "react-hot-toast";

interface Resultado {
  nota_trim1: number;
  nota_trim2: number;
  nota_predicha_trim3: number;
  promedio_final: number;
  pasa: boolean;
  aplazo_trim3: boolean;
}

export default function EstadisticasEstudiante() {
  const { alumnoId } = useParams();
  const [searchParams] = useSearchParams();
  const cursoId = searchParams.get("curso");
  const materiaId = searchParams.get("materia");

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [notasIniciales, setNotasIniciales] = useState<{ nota1: number; nota2: number } | null>(null);
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [nombreCurso, setNombreCurso] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!alumnoId || !cursoId || !materiaId) return;

    // Fetch nombre del estudiante y curso
    fetch(`${AppConfig.API_URL}/alumnos/${alumnoId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNombreEstudiante(`${data.user.nombre} ${data.user.apellido}`);
        setNombreCurso(data.curso.nombre);
      })
      .catch(() => toast.error("Error al obtener datos del alumno"));

    // Fetch nombre de la materia
    fetch(`${AppConfig.API_URL}/materias/${materiaId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNombreMateria(data.nombre))
      .catch(() => toast.error("Error al obtener datos de la materia"));

    // Fetch notas del 1er y 2do trimestre
    fetch(`${AppConfig.API_URL}/notas/prediccion-trim3/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        alumno: Number(alumnoId),
        curso: Number(cursoId),
        materia: Number(materiaId),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotasIniciales({
          nota1: data.nota_trim1,
          nota2: data.nota_trim2,
        });
        setCargando(false);
      })
      .catch(() => {
        toast.error("Error al cargar notas iniciales");
        setCargando(false);
      });
  }, [alumnoId, cursoId, materiaId]);

  const predecirNota = () => {
    if (!alumnoId || !materiaId || !cursoId) return;

    fetch(`${AppConfig.API_URL}/notas/prediccion-trim3/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        alumno: Number(alumnoId),
        curso: Number(cursoId),
        materia: Number(materiaId),
      }),
    })
      .then((res) => res.json())
      .then((data: Resultado) => {
        setResultado(data);
        toast.success("Predicción realizada");
      })
      .catch(() => toast.error("Error al predecir rendimiento"));
  };

  if (cargando) return <p className="p-4 text-[#1D3557]">🔄 Cargando estadísticas...</p>;

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-[#F1FAFB] border border-[#A8DADC]">
        <CardContent className="space-y-3">
          <CardTitle className="text-[#1D3557] font-bold text-xl">
            📊 Estadísticas del Estudiante
          </CardTitle>
          <p><strong>Estudiante:</strong> {nombreEstudiante}</p>
          <p><strong>Curso:</strong> {nombreCurso}</p>
          <p><strong>Materia:</strong> {nombreMateria}</p>

          <p><strong>1er Trimestre:</strong> {notasIniciales?.nota1 ?? "N/A"}</p>
          <p><strong>2do Trimestre:</strong> {notasIniciales?.nota2 ?? "N/A"}</p>

          {!resultado && (
            <Button onClick={predecirNota} className="bg-[#457B9D] hover:bg-[#35688C] text-white">
              📈 Predecir 3er Trimestre
            </Button>
          )}

          {resultado && (
            <div className="pt-2 space-y-2 text-[#1D3557]">
              <p><strong>3er Trimestre (Predicción):</strong> {resultado.nota_predicha_trim3}</p>
              <p><strong>Promedio Final:</strong> {resultado.promedio_final}</p>

              <p className={resultado.aplazo_trim3 ? "text-red-600" : "text-green-600"}>
                {resultado.aplazo_trim3
                  ? "❌ No aprobaste el 3er trimestre"
                  : "✅ Aprobaste el 3er trimestre"}
              </p>

              <p className={resultado.pasa ? "text-green-600" : "text-red-600"}>
                {resultado.pasa
                  ? "🎉 Con esta nota el estudiante APRUEBA la materia"
                  : "❌ NO APRUEBA la materia"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
