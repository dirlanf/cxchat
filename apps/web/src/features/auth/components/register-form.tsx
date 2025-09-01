import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterInput,
} from "../validators/register.schema";
import { registerApi } from "../api/register";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerApi(data);
      toast.success("Conta criada", { id: "register" });
      await refresh();
      navigate("/login");
    } catch (err: any) {
      toast.error(`Erro ao criar conta: ${err?.message ?? "Unknown"}`, {
        id: "register",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 w-full max-w-sm"
    >
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input type="text" {...register("name")} placeholder="" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register("email")} placeholder="" />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input type="password" {...register("password")} placeholder="" />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button disabled={isSubmitting} type="submit">
        Registrar
      </Button>
    </form>
  );
}
