import { Bell, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-[#2F528F] text-white px-6 py-3 flex justify-between items-center shadow-md z-50">
      <h1 className="text-lg font-semibold">Panel de Administración</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-[#3E629B] relative">
              <Bell className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl rounded-lg p-2"
          >
            <DropdownMenuItem className="text-muted-foreground">
              Sin notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="bg-[#424C55] hover:bg-[#5C687A] text-white px-4 py-2 flex items-center rounded-md"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
