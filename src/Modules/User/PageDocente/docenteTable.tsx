import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus,Pencil,Trash2 } from "lucide-react";
import { AppConfig } from "@/config/app-config";
import CreateDocenteDialog from "./docenteCreate";
import EditDocenteDialog from "./docenteEdit";
import { toast } from "react-hot-toast";
import { Docente } from "@/types/docente";

export default function DocentesTable() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [docenteToEdit, setDocenteToEdit] = useState<Docente | null>(null);
  // const [docenteToDelete, setDocenteToDelete] = useState<Docente | null>(null);

  const fetchDocentes = () => {
    setLoading(true);
    fetch(`${AppConfig.API_URL}/docentes/`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data: Docente[]) => setDocentes(data))
      .catch((error) => console.error("Error al obtener docentes:", error))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    fetchDocentes();
  }, []);
  
  const handleEditClick = (docente: Docente) => {
    setDocenteToEdit(docente);
    setOpenEdit(true);
  };
  const handleDeleteClick = async (docente: Docente) => {
    const confirm = window.confirm(`¿Eliminar al docente ${docente.user.username}?`);
    if (!confirm) return;
  
    try {
      const response = await fetch(`${AppConfig.API_URL}/docentes/${docente.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("No se pudo eliminar");
  
      toast.success("Docente eliminado correctamente");
      fetchDocentes(); // Refresca lista
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar docente");
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Docentes</h2>
        <Button onClick={() => setOpenCreate(true)} variant="default">
          <Plus className="w-4 h-4 mr-2" /> Crear Docente
        </Button>
      </div>
  
      {loading ? (
        <p>Cargando docentes...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>CI</TableHead>
              <TableHead>Teléfono</TableHead>
              {/* <TableHead>Materias</TableHead> */}
              <TableHead>Acciones</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {docentes.map((docente) => (
              <TableRow key={docente.id}>
                <TableCell>{docente.id}</TableCell>
                <TableCell>{docente.user.email}</TableCell>
                <TableCell>{docente.user.username}</TableCell>
                <TableCell>{docente.user.nombre}</TableCell>
                <TableCell>{docente.user.apellido}</TableCell>
                <TableCell>{docente.user.ci}</TableCell>
                <TableCell>{docente.user.telefono}</TableCell>
                {/* <TableCell>
                  {docente.materias.length > 0
                    ? docente.materias.map((mat) => mat.nombre).join(", ")
                    : "Sin materias"}
                </TableCell> */}
                <TableCell>
                  {/* <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(docente)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(docente)}>Eliminar</Button>
                  </div> */}

                    <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { handleEditClick(docente); setOpenEdit(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(docente)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
  
      {/* Modal de creación */}
      <CreateDocenteDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          fetchDocentes();
          setOpenCreate(false);
        }}
      />
      < EditDocenteDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onUpdated={() => {
          fetchDocentes();
          setOpenEdit(false);
        }}
        docente={docenteToEdit}
      />
 
    </div>
  );  
}
