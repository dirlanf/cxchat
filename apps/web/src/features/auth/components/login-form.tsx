import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../validators/login.schema";
import { loginApi } from "../api/login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const onSubmit = async (data: LoginInput) => {
    try {
      toast.loading("Logando usuário...", { id: "login" });
      await loginApi(data);
      await refresh();
      toast.success("Usuário logado", { id: "login" });
      navigate("/chat");
    } catch (err: any) {
      toast.error(`Erro ao logar usuário: ${err?.message ?? "Unknown"}`, {
        id: "login",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 w-full max-w-sm"
    >
      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label>Senha</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button disabled={isSubmitting} type="submit">
        Logar
      </Button>
    </form>
  );
}
