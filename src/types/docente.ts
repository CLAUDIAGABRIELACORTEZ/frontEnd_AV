// src/types/docente.ts
export interface Materia {
    id: number;
    nombre: string;
  }
  
  export interface UserData {
    id: number;
    email: string;
    username: string;
    nombre: string;
    apellido: string;
    ci: string;
    telefono: string;
  }
  
  export interface Docente {
    id: number;
    user: UserData;
    materias: Materia[];
  }
  