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
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";
import { Docente, Materia } from "@/types/docente";

interface EditDocenteDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  docente: Docente | null;
}

const EditDocenteDialog: React.FC<EditDocenteDialogProps> = ({ open, onClose, onUpdated, docente }) => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
  });

  useEffect(() => {
    if (docente) {
      setForm({
        email: docente.user.email,
        username: docente.user.username,
        nombre: docente.user.nombre,
        apellido: docente.user.apellido,
        ci: docente.user.ci,
        telefono: docente.user.telefono,
      });

      setSelectedMaterias(docente.materias.map((m) => m.id));
    }
  }, [docente]);

  useEffect(() => {
    if (open) {
      fetch(`${AppConfig.API_URL}/materias/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data: Materia[]) => setMaterias(data))
        .catch((err) => console.error("Error al cargar materias", err));
    }
  }, [open]);

  const handleUpdate = async () => {
    if (!docente) return;

    try {
      const userResponse = await fetch(`${AppConfig.API_URL}/usuarios/${docente.user.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!userResponse.ok) throw new Error("Error actualizando el usuario");

      const docenteResponse = await fetch(`${AppConfig.API_URL}/docentes/${docente.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: docente.user.id,
          materias: selectedMaterias,
        }),
      });

      if (!docenteResponse.ok) throw new Error("Error actualizando el docente");

      toast.success("Docente actualizado correctamente");
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar el docente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow text-[#1D3557]">
        <DialogHeader>
          <DialogTitle className="text-[#1D3557] text-xl font-semibold">Editar Docente</DialogTitle>
          <DialogDescription className="text-[#457B9D]">Modifica los datos del docente seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Nombre de usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          <Input placeholder="CI" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} />
          <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />

          <MultiSelect
            label="Materias"
            options={materias.map((m) => ({ label: m.nombre, value: m.id.toString() }))}
            selectedValues={selectedMaterias.map(String)}
            onChange={(values) => setSelectedMaterias(values.map((v) => parseInt(v)))}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" className="border-[#A8B6C8] text-[#1D3557]" onClick={onClose}>Cancelar</Button>
          <Button className="bg-[#457B9D] hover:bg-[#35688C] text-white" onClick={handleUpdate}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocenteDialog;
