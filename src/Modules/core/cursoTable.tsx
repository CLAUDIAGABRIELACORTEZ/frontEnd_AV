import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CreateCursoDialog from "./cursoCreate";
import EditCursoDialog from "./cursoEdit";
import { AppConfig } from "@/config/app-config";
import { toast } from "react-hot-toast";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

export default function CursoTable() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [cursoToEdit, setCursoToEdit] = useState<Curso | null>(null);

  const fetchCursos = () => {
    setLoading(true);
    fetch(`${AppConfig.API_URL}/cursos/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Curso[]) => setCursos(data))
      .catch((error) => console.error("Error al obtener cursos:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Deseas eliminar este curso?");
    if (!confirm) return;

    try {
      const res = await fetch(`${AppConfig.API_URL}/cursos/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error();
      toast.success("Curso eliminado correctamente");
      fetchCursos();
    } catch {
      toast.error("No se pudo eliminar el curso");
    }
  };

  const handleEdit = (curso: Curso) => {
    setCursoToEdit(curso);
    setOpenEdit(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#516D87]">Lista de Cursos</h2>
        <Button className="bg-[#424C55] hover:bg-[#5C687A] text-white" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Curso
        </Button>
      </div>

      {loading ? (
        <p className="text-[#516D87]">Cargando cursos...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#424C55]">ID</TableHead>
              <TableHead className="text-[#424C55]">Nombre</TableHead>
              <TableHead className="text-[#424C55]">Nivel</TableHead>
              <TableHead className="text-[#424C55]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id} className="hover:bg-[#F1F7FB]">
                <TableCell>{curso.id}</TableCell>
                <TableCell>{curso.nombre}</TableCell>
                <TableCell>{curso.nivel}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#6388A5] text-[#516D87]"
                      onClick={() => handleEdit(curso)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#9AEBDB] hover:bg-[#71ADD8] text-black"
                      onClick={() => handleDelete(curso.id)}
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

      <CreateCursoDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          fetchCursos();
          setOpenCreate(false);
        }}
      />

      <EditCursoDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onUpdated={() => {
          fetchCursos();
          setOpenEdit(false);
        }}
        curso={cursoToEdit}
      />
    </div>
  );
}
