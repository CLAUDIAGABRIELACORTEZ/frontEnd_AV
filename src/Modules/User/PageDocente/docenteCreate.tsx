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
// import { MultiSelect } from "@/components/ui/multi-select"; // Asumimos un componente multiselect existente
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

// interface Materia {
//   id: number;
//   nombre: string;
// }

interface CreateDocenteDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateDocenteDialog: React.FC<CreateDocenteDialogProps> = ({ open, onClose, onCreated }) => {
  // const [materias, setMaterias] = useState<Materia[]>([]);
  // const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
    password: "",
  });

  // useEffect(() => {
  //   if (open) {
  //     fetch(`${AppConfig.API_URL}/materias/`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data: Materia[]) => setMaterias(data))
  //       .catch((err) => console.error("Error al cargar materias", err));
  //   }
  // }, [open]);

  const handleCreate = async () => {
    // Validación mínima
    if (!form.email || !form.username || !form.password) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    try {
      // 1. Crear usuario con rol docente
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

      // 2. Crear docente con materias
      const docenteResponse = await fetch(`${AppConfig.API_URL}/docentes/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          // materias: selectedMaterias,
        }),
      });

      if (!docenteResponse.ok) throw new Error("No se pudo registrar al docente");

      toast.success("Docente creado exitosamente");
      onCreated(); // para refrescar lista
      onClose(); // cerrar modal
      setForm({
        email: "",
        username: "",
        nombre: "",
        apellido: "",
        ci: "",
        telefono: "",
        password: "",
      });
      // setSelectedMaterias([]);
    } catch (err) {
      console.error(err);
      toast.error("Error al crear docente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Docente</DialogTitle>
          <DialogDescription>Completa los datos para crear un nuevo docente.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Nombre de usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          <Input placeholder="CI" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} />
          <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <Input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

          {/* <MultiSelect
            label="Materias"
            options={materias.map((m) => ({ label: m.nombre, value: m.id.toString() }))}
            selectedValues={selectedMaterias.map(String)}
            onChange={(values) => setSelectedMaterias(values.map((v) => parseInt(v)))}
          /> */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleCreate}>Crear Docente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocenteDialog;
