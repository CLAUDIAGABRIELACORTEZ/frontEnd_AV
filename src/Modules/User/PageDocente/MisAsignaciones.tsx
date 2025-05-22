import { useEffect, useState } from "react";
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bienvenido, {nombreDocente}</h2>
      <h3 className="text-xl mb-4">Tus asignaciones:</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asignaciones.map((asig, index) => (
          <div key={index} className="border rounded-lg p-4 shadow bg-white dark:bg-zinc-900">
            <h4 className="text-lg font-semibold mb-1">{asig.materia.nombre}</h4>
            <p className="text-sm text-muted-foreground">
              Curso: {asig.curso.nombre} - {asig.curso.nivel}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
