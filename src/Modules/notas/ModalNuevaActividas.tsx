
// /// -----------------------------------------------------------------
// /// ----- src/components/evaluaciones/ModalNuevaActividad.tsx
// /// -----------------------------------------------------------------

// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import { api } from "@/hooks/useApi";
// import { Button } from "@/components/ui/button";

// interface Props {
//   dim: "ser" | "saber" | "hacer" | "decidir";
//   cursoId: number;
//   materiaId: number;
//   close: () => void;
//   refetch: () => void;
// }

// export default function ModalNuevaActividad({ dim, cursoId, materiaId, close, refetch }: Props) {
//   const { register, handleSubmit, reset } = useForm<{ descripcion: string }>();

//   const onSubmit = async (data: { descripcion: string }) => {
//     await api("POST", "/notas/actividades/", {
//       ...data,
//       dimension: dim,
//       curso: cursoId,
//       materia: materiaId,
//       trimestre: "1er Trimestre" // ← ✅ AÑADE ESTO
//     });
//     reset();
//     close();
//     refetch();
//   };

//   return (
//     <Dialog open onOpenChange={close}>
//       <DialogContent className="space-y-4">
//         <h3 className="text-lg font-semibold">Nueva actividad – {dim.toUpperCase()}</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//           <input
//             {...register("descripcion", { required: true })}
//             placeholder="Descripción"
//             className="input w-full"
//           />
//           <Button type="submit" className="w-full">Guardar</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { api } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";

interface Props {
  dim: "ser" | "saber" | "hacer" | "decidir";
  cursoId: number;
  materiaId: number;
  trimestre: string;
  close: () => void;
  refetch: () => void;
}

export default function ModalNuevaActividad({ dim, cursoId, materiaId, trimestre, close, refetch }: Props) {
  const { register, handleSubmit, reset } = useForm<{ descripcion: string }>();

  const onSubmit = async (data: { descripcion: string }) => {
    await api("POST", "/notas/actividades/", {
      descripcion: data.descripcion,
      dimension: dim,
      curso: cursoId,
      materia: materiaId,
      trimestre: trimestre,
    });
    reset();
    close();
    refetch();
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="space-y-4">
        <h3 className="text-lg font-semibold">Nueva actividad – {dim.toUpperCase()}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("descripcion", { required: true })}
            placeholder="Descripción"
            className="input w-full"
          />
          <Button type="submit" className="w-full">Guardar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
