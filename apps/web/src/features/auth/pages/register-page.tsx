import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RegisterForm } from "../components/register-form";

export function RegisterPage() {
  return (
    <div className="min-h-dvh grid place-items-center">
      <div className="flex flex-col items-center w-full max-w-md space-y-6">
        <Card className="w-full">
          <CardHeader className="justify-center">Registro</CardHeader>
          <CardContent className="flex justify-center">
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
