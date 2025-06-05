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
import { AppConfig } from "@/config/app-config";
import CreateAsignacionDialog from "./asignacionesCreate";
import EditAsignacionDialog from "./asignacionesEdit";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Asignacion {
  id: number;
  curso: Curso;
  materia: Materia;
  docente: Docente;
}

interface AsignacionEdit {
  id: number;
  curso: number;
  materia: number;
  docente: number;
}

export default function AsignacionesTable() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<AsignacionEdit | null>(null);

  const fetchAsignaciones = () => {
    setLoading(true);
    fetch(`${AppConfig.API_URL}/asignaciones/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAsignaciones(data))
      .catch((err) => console.error("Error al obtener asignaciones", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro que deseas eliminar esta asignación?")) return;

    try {
      await fetch(`${AppConfig.API_URL}/asignaciones/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAsignaciones();
    } catch (error) {
      console.error("Error eliminando asignación", error);
    }
  };

  const handleEditClick = (asignacion: any) => {
    const parsed: AsignacionEdit = {
      id: asignacion.id,
      curso: asignacion.curso.id,
      materia: asignacion.materia.id,
      docente: asignacion.docente.id,
    };

    setAsignacionSeleccionada(parsed);
    setEditOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#516D87]">Asignaciones</h2>
        <Button className="bg-[#424C55] hover:bg-[#5C687A] text-white" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nueva asignación
        </Button>
      </div>

      {loading ? (
        <p className="text-[#516D87]">Cargando asignaciones...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#424C55]">Curso</TableHead>
              <TableHead className="text-[#424C55]">Materia</TableHead>
              <TableHead className="text-[#424C55]">Docente</TableHead>
              <TableHead className="text-[#424C55]">Apellido</TableHead>
              <TableHead className="text-[#424C55]">Email</TableHead>
              <TableHead className="text-[#424C55]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asignaciones.map((asignacion) => (
              <TableRow key={asignacion.id} className="hover:bg-[#F1F7FB]">
                <TableCell>{asignacion.curso.nombre}</TableCell>
                <TableCell>{asignacion.materia.nombre}</TableCell>
                <TableCell>{asignacion.docente.nombre}</TableCell>
                <TableCell>{asignacion.docente.apellido}</TableCell>
                <TableCell>{asignacion.docente.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="border-[#6388A5] text-[#516D87]"
                      variant="outline"
                      onClick={() => handleEditClick(asignacion)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#9AEBDB] hover:bg-[#71ADD8] text-black"
                      onClick={() => handleDelete(asignacion.id)}
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

      <CreateAsignacionDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          setOpenCreate(false);
          fetchAsignaciones();
        }}
      />
      <EditAsignacionDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={fetchAsignaciones}
        asignacion={asignacionSeleccionada}
      />
    </div>
  );
}
