// import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

// import DashboardLayout from "./app/dashboard/layout"; // Importamos el Layout
// import { ThemeProvider } from "./components/theme-provider";
// import { Toaster } from "react-hot-toast";
// import ProtectedRoute from "./routes/ProtecteRuote";
// import PageLogin from "./app/login/page";
// import UsersTable from "./Modules/User/Page/userTable";
// import WelcomePage from "./app/dashboard/page";
// import AlumnoTable from "./Modules/User/PageAlumno/alumnoTable";
// import DocentesTable from "./Modules/User/PageDocente/docenteTable";
// import MateriasTable from "./Modules/core/materiasTable";
// import CursoTable from "./Modules/core/cursoTable";
// import AsignacionesTable from "./Modules/core/asignacionesTable";
// import MisAsignaciones from "./Modules/User/PageDocente/MisAsignaciones";

// const AppRoutes = () => {
//   return (
//     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//     <Router>
//       <Toaster position="bottom-right" /> {/*  Agregamos Toaster aquí */}
//       <Routes>
//         {/* Ruta principal con el Login */}
//         <Route path="/" element={<PageLogin />} />

//         {/* Dashboard con Layout */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<DashboardLayout />}>
//             <Route path="/dashboard" element={<WelcomePage />} />
//             <Route path="usuarios" element={<UsersTable />} />
//             <Route path="alumnos" element={<AlumnoTable />} />
//             <Route path="docentes" element={<DocentesTable />} />
//             <Route path="materias" element={<MateriasTable  />} />
//             <Route path="cursos" element={<CursoTable />} />
//             <Route path="asignaciones" element={<AsignacionesTable />} />
//             <Route path="mis_asignaciones" element={<MisAsignaciones />} />
//             {/* <Route path="roles" element={<RolesTable />} />
//             <Route path="permisos" element={<PermissionsTable />} />
//             <Route path="productos" element={<ProductTable />} />
//             <Route path="categorias" element={<CategoriesTable />} />
//             <Route path="reporte-productos" element={<TopSellingProductsReport />} />  */}
//             {/* <Route path="reporte-compras-cliente" element={<ProductsByCustomerReport />} /> */}

//           </Route>
//         </Route>
//       </Routes>
//     </Router>
//   </ThemeProvider>
//   );
// };

// export default AppRoutes;

// AppRoutes.tsx
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "react-hot-toast";

// Páginas
import PageLogin from "./app/login/page";
import DashboardLayout from "./app/dashboard/layout";
import WelcomePage from "./app/dashboard/page";

// Módulos
import UsersTable from "./Modules/User/Page/userTable";
import AlumnoTable from "./Modules/User/PageAlumno/alumnoTable";
import DocentesTable from "./Modules/User/PageDocente/docenteTable";
import MateriasTable from "./Modules/core/materiasTable";
import CursoTable from "./Modules/core/cursoTable";
import AsignacionesTable from "./Modules/core/asignacionesTable";
import MisAsignaciones from "./Modules/User/PageDocente/MisAsignaciones";

// Protecciones
import ProtectedRoute from "./routes/ProtectedRuote";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
                <Route path="usuarios" element={<UsersTable />} />
                <Route path="alumnos" element={<AlumnoTable />} />
                <Route path="docentes" element={<DocentesTable />} />
                <Route path="materias" element={<MateriasTable />} />
                <Route path="cursos" element={<CursoTable />} />
                <Route path="asignaciones" element={<AsignacionesTable />} />
              </Route>

              {/* Rutas para DOCENTE */}
              <Route element={<RoleProtectedRoute role="docente" />}>
                <Route path="mis_asignaciones" element={<MisAsignaciones />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppRoutes;

