import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schemas/authSchema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";

const LoginForm = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const { loginUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    console.log("FORM DATA : ", formData);
    try {
      await loginUser(formData);
      navigate("/profile");
    } catch (error) {
      console.log("ERRORO IN LOGIN", error);
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg">
      <CardContent className="grid p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground text-balance">
                Login to your Plan Ocean account
              </p>
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
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/forgot"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
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
                {errors.password && (
                  <p className="text-red-500 text-sm absolute -bottom-6 left-0">
                    {errors.password.message || "Password is required"}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full cursor-pointer mt-2">
              Login
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
            >
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="google-logo"
                className="w-6 h-6"
              />
              <span>Login with Google</span>
            </Button>

            <div className="text-center text-sm flex items-center justify-center gap-2">
              <span>Don't have an account?</span>
              <Link
                to="/auth/register"
                className="hover:underline underline-offset-4"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
