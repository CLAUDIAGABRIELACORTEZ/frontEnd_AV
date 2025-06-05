import React, { useState } from "react";
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
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface CreateCursoDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateCursoDialog: React.FC<CreateCursoDialogProps> = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({
    nombre: "",
    nivel: "",
  });

  const handleCreate = async () => {
    if (!form.nombre || !form.nivel) {
      toast.error("Todos los campos deben estar completos");
      return;
    }

    try {
      const response = await fetch(`${AppConfig.API_URL}/cursos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("No se pudo crear el curso");

      toast.success("Curso creado correctamente");
      onCreated();
      onClose();
      setForm({ nombre: "", nivel: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error al crear curso");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#F9FCFD]">
        <DialogHeader>
          <DialogTitle className="text-[#516D87]">Registrar Curso</DialogTitle>
          <DialogDescription>Completa los datos para crear un nuevo curso.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre del curso"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            placeholder="Nivel (Ej: Secundaria)"
            value={form.nivel}
            onChange={(e) => setForm({ ...form, nivel: e.target.value })}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-[#6388A5] text-[#516D87]"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-[#424C55] hover:bg-[#5C687A] text-white"
          >
            Crear Curso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCursoDialog;
