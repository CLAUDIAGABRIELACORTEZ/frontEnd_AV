// import  { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { AppConfig } from "@/config/app-config";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// interface Curso {
//   id: number;
//   nombre: string;
//   nivel: string;
// }

// interface Materia {
//   id: number;
//   nombre: string;
// }

// interface Alumno {
//   id: number;
//   curso: Curso;
//   materia: Materia;
//   user: {
//     id: number;
//     nombre: string;
//     apellido: string;
//     email: string;
//   };
// }

// export default function MisEstudiantesTable() {
//   const [alumnos, setAlumnos] = useState<Alumno[]>([]);
//   const [busqueda, setBusqueda] = useState("");
//   const [cursoFiltro, setCursoFiltro] = useState("");
//   const [materiaFiltro, setMateriaFiltro] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${AppConfig.API_URL}/mis-estudiantes-todos/`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setAlumnos(data))
//       .catch(() => toast.error("Error al cargar alumnos"));
//   }, []);

//   const cursosUnicos = Array.from(new Set(alumnos.map((a) => a.curso.nombre)));
//   const materiasUnicas = Array.from(new Set(alumnos.map((a) => a.materia.nombre)));

//   const alumnosFiltrados = alumnos.filter((a) => {
//     const coincideCurso = cursoFiltro ? a.curso.nombre === cursoFiltro : true;
//     const coincideMateria = materiaFiltro ? a.materia.nombre === materiaFiltro : true;
//     const coincideNombre = `${a.user.nombre} ${a.user.apellido}`
//       .toLowerCase()
//       .includes(busqueda.toLowerCase());
//     return coincideCurso && coincideMateria && coincideNombre;
//   });

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-4">
//         <select
//           className="border rounded p-2"
//           value={cursoFiltro}
//           onChange={(e) => setCursoFiltro(e.target.value)}
//         >
//           <option value="">Todos los cursos</option>
//           {cursosUnicos.map((c) => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>

//         <select
//           className="border rounded p-2"
//           value={materiaFiltro}
//           onChange={(e) => setMateriaFiltro(e.target.value)}
//         >
//           <option value="">Todas las materias</option>
//           {materiasUnicas.map((m) => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>

//         <Input
//           placeholder="Buscar por nombre"
//           value={busqueda}
//           onChange={(e) => setBusqueda(e.target.value)}
//         />
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Nombre</TableHead>
//             <TableHead>Correo</TableHead>
//             <TableHead>Curso</TableHead>
//             <TableHead>Materia</TableHead>
//             <TableHead>Acciones</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {alumnosFiltrados.map((alumno) => (
//             <TableRow key={`${alumno.user.id}-${alumno.materia.id}`}>
//               <TableCell>{alumno.user.nombre} {alumno.user.apellido}</TableCell>
//               <TableCell>{alumno.user.email}</TableCell>
//               <TableCell>{alumno.curso.nombre}</TableCell>
//               <TableCell>{alumno.materia.nombre}</TableCell>
//               <TableCell>
//                 <Button
//                   onClick={() =>
//                     // navigate(`/estadisticas/${alumno.user.id}?curso=${alumno.curso.id}&materia=${alumno.materia.id}`)
//                     navigate(`/dashboard/estadisticas/${alumno.id}?curso=${alumno.curso.id}&materia=${alumno.materia.id}`)

//                   }
//                 >
//                   Ver Estadísticas
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/config/app-config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Alumno {
  id: number;
  curso: Curso;
  materia: Materia;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export default function MisEstudiantesTable() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true); // estado de carga
  const [busqueda, setBusqueda] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState("");
  const [materiaFiltro, setMateriaFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${AppConfig.API_URL}/mis-estudiantes-todos/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAlumnos(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar alumnos");
        setLoading(false);
      });
  }, []);

  const cursosUnicos = Array.from(new Set(alumnos.map((a) => a.curso.nombre)));
  const materiasUnicas = Array.from(new Set(alumnos.map((a) => a.materia.nombre)));

  const alumnosFiltrados = alumnos.filter((a) => {
    const coincideCurso = cursoFiltro ? a.curso.nombre === cursoFiltro : true;
    const coincideMateria = materiaFiltro ? a.materia.nombre === materiaFiltro : true;
    const coincideNombre = `${a.user.nombre} ${a.user.apellido}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCurso && coincideMateria && coincideNombre;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-10 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-gray-600 text-lg">Cargando alumnos...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select
          className="border rounded p-2"
          value={cursoFiltro}
          onChange={(e) => setCursoFiltro(e.target.value)}
        >
          <option value="">Todos los cursos</option>
          {cursosUnicos.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={materiaFiltro}
          onChange={(e) => setMateriaFiltro(e.target.value)}
        >
          <option value="">Todas las materias</option>
          {materiasUnicas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <Input
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Materia</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alumnosFiltrados.map((alumno) => (
            <TableRow key={`${alumno.user.id}-${alumno.materia.id}`}>
              <TableCell>{alumno.user.nombre} {alumno.user.apellido}</TableCell>
              <TableCell>{alumno.user.email}</TableCell>
              <TableCell>{alumno.curso.nombre}</TableCell>
              <TableCell>{alumno.materia.nombre}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    navigate(
                      `/dashboard/estadisticas/${alumno.id}?curso=${alumno.curso.id}&materia=${alumno.materia.id}`
                    )
                  }
                >
                  Ver Estadísticas
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
