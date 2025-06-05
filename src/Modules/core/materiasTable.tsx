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
import CreateMateriaDialog from "./materiaCreate";
import EditMateriaDialog from "./materiaEdit";
import { toast } from "react-hot-toast";

interface Materia {
  id: number;
  nombre: string;
}

export default function MateriasTable() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [materiaToEdit, setMateriaToEdit] = useState<Materia | null>(null);

  const fetchMaterias = () => {
    setLoading(true);
    fetch(`${AppConfig.API_URL}/materias/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Materia[]) => setMaterias(data))
      .catch((error) => console.error("Error al obtener materias:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar esta materia?");
    if (!confirm) return;

    try {
      const res = await fetch(`${AppConfig.API_URL}/materias/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      toast.success("Materia eliminada");
      fetchMaterias();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar la materia");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#516D87]">Materias</h2>
        <Button className="bg-[#424C55] hover:bg-[#5C687A] text-white" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Materia
        </Button>
      </div>

      {loading ? (
        <p className="text-[#516D87]">Cargando materias...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#424C55]">ID</TableHead>
              <TableHead className="text-[#424C55]">Nombre</TableHead>
              <TableHead className="text-[#424C55]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materias.map((materia) => (
              <TableRow key={materia.id} className="hover:bg-[#F1F7FB]">
                <TableCell>{materia.id}</TableCell>
                <TableCell>{materia.nombre}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#6388A5] text-[#516D87]"
                      onClick={() => {
                        setMateriaToEdit(materia);
                        setOpenEdit(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#9AEBDB] hover:bg-[#71ADD8] text-black"
                      onClick={() => handleDelete(materia.id)}
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

      <CreateMateriaDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          fetchMaterias();
          setOpenCreate(false);
        }}
      />

      <EditMateriaDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onUpdated={() => {
          fetchMaterias();
          setOpenEdit(false);
        }}
        materia={materiaToEdit}
      />
    </div>
  );
}
