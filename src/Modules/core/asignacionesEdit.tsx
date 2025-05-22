import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/config/app-config";
// import { Asignacion } from "@/types/asignacion";

interface Curso {
  id: number;
  nombre: string;
  nivel: string;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
}

interface Asignacion {
  id: number;
  curso: number;
  materia: number;
  docente: number;
}

interface EditAsignacionDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  asignacion?: Asignacion | null;
}

const EditAsignacionDialog: React.FC<EditAsignacionDialogProps> = ({ open, onClose, onUpdated, asignacion }) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [form, setForm] = useState({ curso: 0, materia: 0, docente: 0 });

  useEffect(() => {
    if (asignacion) {
      setForm({
        curso: asignacion.curso,
        materia: asignacion.materia,
        docente: asignacion.docente,
      });
    }
  }, [asignacion]);

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch(`${AppConfig.API_URL}/cursos/`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        fetch(`${AppConfig.API_URL}/materias/`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        fetch(`${AppConfig.API_URL}/usuarios/?rol=docente`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
      ])
        .then(async ([res1, res2, res3]) => {
          const [data1, data2, data3] = await Promise.all([res1.json(), res2.json(), res3.json()]);
          setCursos(data1);
          setMaterias(data2);
          setDocentes(data3);
        });
    }
  }, [open]);

  const handleUpdate = async () => {
    if (!asignacion) return;

    const res = await fetch(`${AppConfig.API_URL}/asignaciones/${asignacion.id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onUpdated();
      onClose();
    } else {
      console.error("Error al actualizar asignación");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Asignación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <select value={form.curso} onChange={(e) => setForm({ ...form, curso: parseInt(e.target.value) })} className="w-full border p-2 rounded">
            <option value="">Selecciona un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre} ({curso.nivel})
              </option>
            ))}
          </select>

          <select value={form.materia} onChange={(e) => setForm({ ...form, materia: parseInt(e.target.value) })} className="w-full border p-2 rounded">
            <option value="">Selecciona una materia</option>
            {materias.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre}
              </option>
            ))}
          </select>

          <select value={form.docente} onChange={(e) => setForm({ ...form, docente: parseInt(e.target.value) })} className="w-full border p-2 rounded">
            <option value="">Selecciona un docente</option>
            {docentes.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.nombre} {doc.apellido}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdate}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAsignacionDialog;
