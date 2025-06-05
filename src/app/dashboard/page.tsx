export default function WelcomePage() {
  return (
    <div className="p-8">
      <div className="bg-[#F1FAFB] dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-[#A8DADC]">
        <h1 className="text-2xl font-bold text-[#1D3557] mb-2">
          🎓 Bienvenido al Aula Virtual
        </h1>
        <p className="text-[#1D3557] text-sm leading-relaxed">
          Esta es la plataforma académica del <strong>colegio Héroes del Hacho – Turno Tarde</strong>. <br />
          Desde aquí podrás gestionar alumnos, docentes, materias y llevar un seguimiento detallado del rendimiento académico.
          <br /><br />
          Usa el menú lateral para navegar por los módulos disponibles y comenzar a trabajar.
        </p>
      </div>
    </div>
  );
}
