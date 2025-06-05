import React, { useState, useEffect } from "react";
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

interface EditMateriaDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  materia: {
    id: number;
    nombre: string;
  } | null;
}

const EditMateriaDialog: React.FC<EditMateriaDialogProps> = ({
  open,
  onClose,
  onUpdated,
  materia,
}) => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (materia) {
      setNombre(materia.nombre);
    }
  }, [materia]);

  const handleUpdate = async () => {
    if (!materia) return;

    try {
      const response = await fetch(`${AppConfig.API_URL}/materias/${materia.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });

      if (!response.ok) throw new Error("Error al actualizar la materia");

      toast.success("Materia actualizada correctamente");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar la materia");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#F9FCFD]">
        <DialogHeader>
          <DialogTitle className="text-[#516D87]">Editar Materia</DialogTitle>
          <DialogDescription>Modifica el nombre de la materia.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre de la materia"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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
            variant="default"
            className="bg-[#424C55] hover:bg-[#5C687A] text-white"
            onClick={handleUpdate}
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMateriaDialog;
