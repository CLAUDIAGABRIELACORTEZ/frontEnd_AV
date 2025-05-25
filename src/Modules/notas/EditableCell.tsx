import { useState } from "react";
import { api } from "@/hooks/useApi";

interface Props {
  alumnoId: number;
  actividadId: number; // -1 = autoevaluacion
  notaInicial: number | undefined;
  onSaved: () => void;
  cursoId: number;
  materiaId: number;
  trimestre: string;
}

export default function EditableCell({ alumnoId, actividadId, notaInicial, onSaved, cursoId, materiaId, trimestre }: Props) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<number | "">(notaInicial ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (value === "" || isNaN(Number(value))) return setEdit(false);
    setSaving(true);

    const payload: any = {
      alumno: alumnoId,
      nota: Number(value),
    };

    const endpoint = actividadId === -1 ? "/notas/autoevaluaciones/" : "/notas/notas-actividad/";

    if (actividadId === -1) {
      payload.curso = cursoId;
      payload.materia = materiaId;
      payload.trimestre = trimestre;
    } else {
      payload.evaluacion = actividadId;
    }

    try {
      await api("POST", endpoint, payload);

    } catch (err) {
      console.error("Error guardando nota:", err);
    } finally {
      setSaving(false);
      setEdit(false);
      onSaved();
    }
  };

  return edit ? (
    <input
      type="number"
      min={0}
      max={100}
      value={value}
      autoFocus
      className="w-16 border text-center"
      onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && save()}
    />
  ) : (
    <span onDoubleClick={() => setEdit(true)} className="cursor-pointer select-none">
      {notaInicial ?? "-"}
      {saving && "…"}
    </span>
  );
}
