import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/schemas/authSchema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";

const RegisterForm = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const { registerUser, isLoading } = useAuthStore();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (formData) => {
    if (isLoading) return;
    try {
      setRegisterSuccess(false);
      await registerUser(formData);
      setRegisterSuccess(true);
      console.log("Submitting registration form with data:", formData);
    } catch (error) {
      setRegisterSuccess(false);
      console.error("Error during form submission:", error);
      return;
    }
  };

  if (registerSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Registration Successful!</h1>
        <p className="text-gray-500 mt-2">
          Please check your email to verify your account.
        </p>
        <Link
          to={"/auth/login"}
          className="text-gray-200 hover:bg-zinc-800 bg-zinc-900 border rounded-md px-4 py-2 mt-4"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg">
      <CardContent className="grid p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome</h1>
              <p className="text-muted-foreground text-balance">
                Create an account to get started
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                id="fullname"
                type="fullname"
                {...register("fullname")}
                placeholder="Enter your fullname"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                {...register("username")}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={hidePassword ? "password" : "text"}
                  required
                  {...register("password")}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="absolute right-0  top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {hidePassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              Register
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full gap-2 cursor-pointer"
              onClick={() =>
                (window.location.href = `${
                  import.meta.env.VITE_BACKEND_URL
                }/api/v1/auth/google`)
              }
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="google-logo"
                className="w-6 h-6"
              />
              <span>Register with Google</span>
            </Button>

            <div className="text-center text-sm flex items-center justify-center gap-2">
              <span>Already have an account?</span>
              <Link
                to="/auth/login"
                className="hover:underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
