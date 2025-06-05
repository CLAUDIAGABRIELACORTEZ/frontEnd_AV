// import * as React from "react";
import { House, SquareTerminal, BookOpen } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavMainMediun } from "@/components/nav-main-mediun";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import LogoutButton from "@/app/dashboard/siderbar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const rol = localStorage.getItem("rol");

  const navMainItems =
    rol === "director"
      ? [
          {
            title: "Gestión De Usuario",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
              { title: "Alumnos", url: "alumnos" },
              { title: "Docentes", url: "docentes" },
            ],
          },
        ]
      : [];

  const navMainMediumItems =
    rol === "director"
      ? [
          {
            title: "Gestión Materia y Curso",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
              { title: "Materias", url: "materias" },
              { title: "Cursos", url: "cursos" },
              { title: "Asignaciones", url: "asignaciones" },
            ],
          },
        ]
      : rol === "docente"
      ? [
          {
            title: "Mis Cursos",
            url: "#",
            icon: BookOpen,
            isActive: true,
            items: [
              { title: "Mis Asignaciones", url: "mis_asignaciones" },
              { title: "Prediccion", url: "mis-estudiantes" },
            ],
          },
        ]
      : [];

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-gradient-to-b from-[#71ADD8] to-[#516D87] text-white shadow-xl"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 text-xl font-bold px-4 py-4 tracking-wide">
          <House className="w-8 h-8 text-white" />
          <span>AULA VIRTUAL</span>
        </div>
        <hr className="border-[#9AEBDB]/30 my-2" />
      </SidebarHeader>

      <SidebarContent className="space-y-2 px-2">
        <NavMain items={navMainItems} />
        <hr className="border-[#9AEBDB]/30 my-2" />
        <NavMainMediun items={navMainMediumItems} />
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 mt-auto">
        {/* <LogoutButton /> */}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
