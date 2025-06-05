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
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

interface CreateAlumnoDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateAlumnoDialog: React.FC<CreateAlumnoDialogProps> = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    nombre: "",
    apellido: "",
    ci: "",
    telefono: "",
    password: "",
  });

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<number | null>(null);

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

  useEffect(() => {
    if (open) {
      // Resetear formulario al abrir
      setForm({
        email: "",
        username: "",
        nombre: "",
        apellido: "",
        ci: "",
        telefono: "",
        password: "",
      });
      setSelectedCurso(null);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!form.email || !form.username || !form.password || !selectedCurso) {
      toast.error("Todos los campos obligatorios deben completarse");
      return;
    }

    try {
      // Crear usuario
      const userRes = await fetch(`${AppConfig.API_URL}/usuarios/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, rol: "alumno" }),
      });

      if (!userRes.ok) throw new Error("No se pudo crear el usuario");
      const user = await userRes.json();

      // Crear alumno
      const alumnoRes = await fetch(`${AppConfig.API_URL}/alumnos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          curso: selectedCurso,
        }),
      });

      if (!alumnoRes.ok) throw new Error("No se pudo registrar al alumno");

      toast.success("Alumno creado correctamente");
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear alumno");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Alumno</DialogTitle>
          <DialogDescription>Completa los datos para crear un nuevo alumno.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Nombre de usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          <Input placeholder="CI" value={form.ci} onChange={(e) => setForm({ ...form, ci: e.target.value })} />
          <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <Input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

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
            onClick={handleCreate}
          >
            Crear Alumno
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlumnoDialog;
