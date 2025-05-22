import React, { useState, useEffect } from "react";
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
import { Curso } from "@/types/curso";
import { toast } from "react-hot-toast";

interface EditCursoDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  curso: Curso | null;
}

const EditCursoDialog: React.FC<EditCursoDialogProps> = ({ open, onClose, onUpdated, curso }) => {
  const [form, setForm] = useState({ nombre: "", nivel: "" });

  useEffect(() => {
    if (curso) {
      setForm({ nombre: curso.nombre, nivel: curso.nivel });
    }
  }, [curso]);

  const handleUpdate = async () => {
    if (!curso) return;

    try {
      const response = await fetch(`${AppConfig.API_URL}/cursos/${curso.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("No se pudo actualizar el curso");

      toast.success("Curso actualizado correctamente");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar curso");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
          <DialogDescription>Modifica los datos del curso seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input placeholder="Nivel" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleUpdate}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCursoDialog;
