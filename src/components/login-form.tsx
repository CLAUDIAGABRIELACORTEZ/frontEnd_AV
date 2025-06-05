import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import api from "@/lib/api"
import { User } from "lucide-react"
import { AppConfig } from "@/config/app-config"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await api.post("/token/", { email, password })
      const { access } = response.data as { access: string }

      localStorage.setItem("token", access)

      const userRes = await fetch(`${AppConfig.API_URL}/auth/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })

      if (!userRes.ok) throw new Error("Error al obtener usuario")
      const user = await userRes.json()

      localStorage.setItem("rol", user.rol)
      localStorage.setItem("username", user.username)

      if (user.rol === "director" || user.rol === "docente") {
        window.location.href = "/dashboard"
      } else {
        setError("Rol no permitido.")
        return
      }
    } catch (err: any) {
      console.error(err)
      setError("Email o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen bg-[url('/fondo-login.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="bg-white/90 dark:bg-black/90 rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-[#6388A5] text-white p-3 rounded-full">
            <User size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-[#516D87]">Bienvenido de nuevo</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ejemplo: gabi111@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ejemplo: 1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-[#9AEBDB] text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#424C55] hover:bg-[#5C687A] text-white"
          >
            Iniciar sesión
          </Button>
        </form>

        <div className="text-sm text-muted-foreground mt-6 space-y-1">
          <p className="hover:underline cursor-pointer">¿Olvidaste tu contraseña?</p>
          <p className="hover:underline cursor-pointer">¿No tienes una cuenta?</p>
        </div>
      </div>
    </div>
  )
}
