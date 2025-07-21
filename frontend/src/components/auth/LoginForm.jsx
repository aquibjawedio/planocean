import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginSchema } from "@/schemas/authSchema";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";
import InputField from "../fields/InputField";
import PasswordField from "../fields/PasswordField";

const LoginForm = () => {
  const { loginUser } = useAuthStore();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Plan Ocean account
                </p>
              </div>

              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />

              <PasswordField
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
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
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
