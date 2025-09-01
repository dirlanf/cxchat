import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LoginForm } from "../components/login-form";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-4">
      <div className="flex flex-col items-center w-full max-w-md space-y-6">
        <Card className="w-full">
          <CardHeader className="justify-center">Login</CardHeader>
          <CardContent className="flex justify-center">
            <LoginForm />
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link className="underline" to="/register">
                Crie uma
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
