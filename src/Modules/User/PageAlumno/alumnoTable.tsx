import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppConfig } from "@/config/app-config";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CreateAlumnoDialog from "./alumnoCreate";
import EditAlumnoDialog from "./alumnoEdit";
import { toast } from "react-hot-toast";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

interface Alumno {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
    nombre: string;
    apellido: string;
    ci: string;
    telefono: string;
    rol: "alumno";
  };
  curso: Curso | null;
}

export default function AlumnosTable() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [alumnoToEdit, setAlumnoToEdit] = useState<Alumno | null>(null);

  const fetchAlumnos = () => {
    setLoading(true);
    fetch(`${AppConfig.API_URL}/alumnos/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Alumno[]) => setAlumnos(data))
      .catch((error) => console.error("Error al obtener alumnos:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleEditClick = (alumno: Alumno) => {
    setAlumnoToEdit(alumno);
    setOpenEdit(true);
  };

  const handleDeleteClick = async (alumno: Alumno) => {
    const confirm = window.confirm(`¿Eliminar al alumno ${alumno.user.username}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${AppConfig.API_URL}/alumnos/${alumno.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      toast.success("Alumno eliminado correctamente");
      fetchAlumnos();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar alumno");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1D3557]">Lista de Alumnos</h2>
        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-[#457B9D] hover:bg-[#35688C] text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Crear Alumno
        </Button>
      </div>

      {loading ? (
        <p className="text-[#1D3557]">Cargando alumnos...</p>
      ) : (
        <Table className="w-full border border-[#B4CDE6] text-sm text-[#1D3557]">
          <TableHeader className="bg-[#E0EBF5]">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>CI</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alumnos.map((alumno) => (
              <TableRow key={alumno.id} className="hover:bg-[#F5FAFF] transition-colors">
                <TableCell>{alumno.id}</TableCell>
                <TableCell>{alumno.user.email}</TableCell>
                <TableCell>{alumno.user.username}</TableCell>
                <TableCell>{alumno.user.nombre}</TableCell>
                <TableCell>{alumno.user.apellido}</TableCell>
                <TableCell>{alumno.user.ci}</TableCell>
                <TableCell>{alumno.user.telefono}</TableCell>
                <TableCell>
                  {alumno.curso ? `${alumno.curso.nombre} (${alumno.curso.nivel})` : "Sin curso"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border border-[#A8B6C8] text-[#3B5F82] hover:bg-[#E8F1FA]"
                      onClick={() => handleEditClick(alumno)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleDeleteClick(alumno)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateAlumnoDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          fetchAlumnos();
          setOpenCreate(false);
        }}
      />

      <EditAlumnoDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onUpdated={() => {
          fetchAlumnos();
          setOpenEdit(false);
        }}
        alumno={alumnoToEdit}
      />
    </div>
  );
}
