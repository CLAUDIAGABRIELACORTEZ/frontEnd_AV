import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface CreateMateriaDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateMateriaDialog: React.FC<CreateMateriaDialogProps> = ({ open, onClose, onCreated }) => {
  const [nombre, setNombre] = useState("");

  const handleCreate = async () => {
    if (!nombre.trim()) {
      toast.error("El nombre de la materia es obligatorio");
      return;
    }

    try {
      const response = await fetch(`${AppConfig.API_URL}/materias/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });

      if (!response.ok) throw new Error("Error al crear la materia");

      toast.success("Materia creada exitosamente");
      setNombre("");
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo crear la materia");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Materia</DialogTitle>
          <DialogDescription>Ingresa el nombre de la nueva materia.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre de la materia"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleCreate}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMateriaDialog;
