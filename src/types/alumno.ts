export interface Curso {
    id: number;
    nombre: string;
    nivel: string;
  }
  
  export interface Alumno {
    id: number;
    user: {
      id: number;
      email: string;
      username: string;
      nombre: string;
      apellido: string;
      ci: string;
      telefono: string;
      rol: "alumno";
    };
    curso: Curso | null;
    // materias?: Materia[]; // opcional, si decides incluirlas más adelante
  }
  