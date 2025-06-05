import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppConfig } from "@/config/app-config";
import { Curso, Alumno } from "@/types/alumno";
import { toast } from "react-hot-toast";

interface EditAlumnoDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  alumno: Alumno | null;
}

const EditAlumnoDialog: React.FC<EditAlumnoDialogProps> = ({ open, onClose, onUpdated, alumno }) => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
  });

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<number | null>(null);

  useEffect(() => {
    if (open && alumno) {
      setForm({
        email: alumno.user.email,
        username: alumno.user.username,
        nombre: alumno.user.nombre,
        apellido: alumno.user.apellido,
        ci: alumno.user.ci,
        telefono: alumno.user.telefono,
      });
      setSelectedCurso(alumno.curso?.id ?? null);
    }
  }, [open, alumno]);

  useEffect(() => {
    if (open) {
      fetch(`${AppConfig.API_URL}/cursos/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data: Curso[]) => setCursos(data))
        .catch((err) => console.error("Error al cargar cursos", err));
    }
  }, [open]);

  const handleUpdate = async () => {
    if (!alumno) return;

    try {
      const userResponse = await fetch(`${AppConfig.API_URL}/usuarios/${alumno.user.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!userResponse.ok) throw new Error("Error actualizando el usuario");

      const alumnoResponse = await fetch(`${AppConfig.API_URL}/alumnos/${alumno.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: alumno.user.id,
          curso: selectedCurso,
        }),
      });

      if (!alumnoResponse.ok) throw new Error("Error actualizando el alumno");

      toast.success("Alumno actualizado correctamente");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar el alumno");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Alumno</DialogTitle>
          <DialogDescription>Modifica los datos del alumno.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Nombre de usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          <Input placeholder="CI" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} />
          <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />

          <select
            className="w-full rounded border border-[#B4CDE6] bg-white p-2 text-sm text-[#1D3557] focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
            value={selectedCurso ?? ''}
            onChange={(e) => setSelectedCurso(Number(e.target.value))}
          >
            <option value="">Selecciona un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre} ({curso.nivel})
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border border-[#A8B6C8] text-[#3B5F82] hover:bg-[#E8F1FA]"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            className="bg-[#457B9D] hover:bg-[#35688C] text-white"
            onClick={handleUpdate}
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAlumnoDialog;
