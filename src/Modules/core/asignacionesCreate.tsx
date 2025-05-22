import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/config/app-config";

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

interface CreateAsignacionDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateAsignacionDialog({ open, onClose, onCreated }: CreateAsignacionDialogProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);

  const [cursoId, setCursoId] = useState<number | null>(null);
  const [materiaId, setMateriaId] = useState<number | null>(null);
  const [docenteId, setDocenteId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      fetch(`${AppConfig.API_URL}/cursos/`, headers()).then(res => res.json()).then(setCursos);
      fetch(`${AppConfig.API_URL}/materias/`, headers()).then(res => res.json()).then(setMaterias);
      fetch(`${AppConfig.API_URL}/usuarios/`, headers()).then(res => res.json()).then((data) => {
        const soloDocentes = data.filter((u: any) => u.rol === "docente");
        setDocentes(soloDocentes);
      });
    }
  }, [open]);

  const headers = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    }
  });

  const handleSubmit = async () => {
    if (!cursoId || !materiaId || !docenteId) return;

    const res = await fetch(`${AppConfig.API_URL}/asignaciones/`, {
      method: "POST",
      ...headers(),
      body: JSON.stringify({ curso: cursoId, materia: materiaId, docente: docenteId }),
    });

    if (res.ok) {
      onCreated();
      onClose();
    } else {
      const error = await res.json();
      alert(error?.detail || "Error al crear asignación:Ya existe un docente dando esa materia");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar materia a docente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <select className="w-full border p-2 rounded" value={cursoId ?? ""} onChange={e => setCursoId(Number(e.target.value))}>
            <option value="">Selecciona un curso</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>)}
          </select>

          <select className="w-full border p-2 rounded" value={materiaId ?? ""} onChange={e => setMateriaId(Number(e.target.value))}>
            <option value="">Selecciona una materia</option>
            {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>

          <select className="w-full border p-2 rounded" value={docenteId ?? ""} onChange={e => setDocenteId(Number(e.target.value))}>
            <option value="">Selecciona un docente</option>
            {docentes.map(d => <option key={d.id} value={d.id}>{d.nombre} {d.apellido}</option>)}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleSubmit}>Asignar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
