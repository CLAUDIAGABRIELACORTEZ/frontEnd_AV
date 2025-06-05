import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppConfig } from "@/config/app-config";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Asignacion {
  curso: Curso;
  materia: Materia;
}

export default function MisAsignaciones() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [nombreDocente, setNombreDocente] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${AppConfig.API_URL}/mis-asignaciones/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAsignaciones(data.asignaciones);
        setNombreDocente(data.docente);
      })
      .catch((err) => console.error("Error cargando asignaciones", err));
  }, []);

  const handleClick = (cursoId: number, materiaId: number) => {
    navigate(`/dashboard/evaluaciones/${cursoId}/${materiaId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#1D3557]">
        Bienvenido, {nombreDocente}
      </h2>
      <h3 className="text-xl mb-6 text-[#457B9D]">Tus asignaciones:</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asignaciones.map((asig, index) => (
          <div
            key={index}
            onClick={() => handleClick(asig.curso.id, asig.materia.id)}
            className="cursor-pointer border border-[#A8DADC] rounded-xl p-5 shadow-md bg-[#F1FAFB] hover:bg-[#E0F3F5] transition-colors duration-200"
          >
            <h4 className="text-lg font-semibold text-[#1D3557] mb-1">
              {asig.materia.nombre}
            </h4>
            <p className="text-sm text-[#457B9D]">
              Curso: {asig.curso.nombre} - {asig.curso.nivel}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
