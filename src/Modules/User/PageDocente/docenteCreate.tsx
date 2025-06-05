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

interface CreateDocenteDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateDocenteDialog: React.FC<CreateDocenteDialogProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
    password: "",
  });

  const handleCreate = async () => {
    if (!form.email || !form.username || !form.password) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    try {
      const userResponse = await fetch(`${AppConfig.API_URL}/usuarios/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          rol: "docente",
        }),
      });

      if (!userResponse.ok) throw new Error("No se pudo crear el usuario");

      const user = await userResponse.json();

      const docenteResponse = await fetch(`${AppConfig.API_URL}/docentes/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
        }),
      });

      if (!docenteResponse.ok) throw new Error("No se pudo registrar al docente");

      toast.success("Docente creado exitosamente");
      onCreated();
      onClose();
      setForm({
        email: "",
        username: "",
        nombre: "",
        apellido: "",
        ci: "",
        telefono: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al crear docente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg text-[#1D3557]">
        <DialogHeader>
          <DialogTitle className="text-[#1D3557] text-xl font-semibold">Registrar Docente</DialogTitle>
          <DialogDescription className="text-[#457B9D]">Completa los datos para crear un nuevo docente.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Nombre de usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          <Input placeholder="CI" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} />
          <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <Input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        <DialogFooter>
          <Button variant="outline" className="border-[#A8B6C8] text-[#1D3557]" onClick={onClose}>Cancelar</Button>
          <Button className="bg-[#457B9D] hover:bg-[#35688C] text-white" onClick={handleCreate}>Crear Docente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocenteDialog;
