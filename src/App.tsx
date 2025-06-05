// AppRoutes.tsx
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "react-hot-toast";

// Páginas
import PageLogin from "./app/login/page";
import DashboardLayout from "./app/dashboard/layout";
import WelcomePage from "./app/dashboard/page";

// Módulos
// ALUMNOS Y DOCENTES
import AlumnoTable from "./Modules/User/PageAlumno/alumnoTable";
import DocentesTable from "./Modules/User/PageDocente/docenteTable";
// import MisEstudiantesTable from "./Modules/User/PageDocente/MisEstudiantesTable";
// import EstadisticasEstudianteWrapper from "./Modules/User/PageDocente/EstadisticasEstudiante";
import MisEstudiantesTable from "@/Modules/User/PageDocente/MisEstudiantesTable";

//CORE
import MateriasTable from "./Modules/core/materiasTable";
import CursoTable from "./Modules/core/cursoTable";
import AsignacionesTable from "./Modules/core/asignacionesTable";
import MisAsignaciones from "./Modules/User/PageDocente/MisAsignaciones";
// import ResumenNotasTabla from "./Modules/notas/TablaResumen";
// Protecciones
import ProtectedRoute from "./routes/ProtectedRuote";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import EvaluacionesPage from "./Modules/notas/EvaluacionesPage"; 
import EstadisticasEstudiante from "./Modules/User/PageDocente/EstadisticasEstudiante";

const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Toaster position="bottom-right" />

        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<PageLogin />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Página principal */}
              <Route index element={<WelcomePage />} />

              {/* Rutas para DIRECTOR */}
              <Route element={<RoleProtectedRoute role="director" />}>
                {/* <Route path="usuarios" element={<UsersTable />} /> */}
                <Route path="alumnos" element={<AlumnoTable />} />
                <Route path="docentes" element={<DocentesTable />} />
                <Route path="materias" element={<MateriasTable />} />
                <Route path="cursos" element={<CursoTable />} />
                <Route path="asignaciones" element={<AsignacionesTable />} />
              </Route>

              {/* Rutas para DOCENTE */}
              <Route element={<RoleProtectedRoute role="docente" />}>
                <Route path="mis_asignaciones" element={<MisAsignaciones />} />
                <Route path="evaluaciones/:cursoId/:materiaId" element={<EvaluacionesPage />} />
                <Route path="estadisticas/:alumnoId" element={<EstadisticasEstudiante />} />
                <Route path="mis-estudiantes" element={<MisEstudiantesTable />} />
                {/* <Route path="Prediccion" element={<MisEstudiantesTable />} /> */}

              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppRoutes;

