import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { resendVerificationEmailSchema } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores/authStore";

const ResendVerificationEmail = () => {
  const { resendEmailVerification, isLoading } = useAuthStore();
  const [error, setError] = useState(null);

  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resendVerificationEmailSchema),
  });

  const onSubmit = async (formData) => {
    try {
      setSuccess(null);
      setError(null);
      const response = await resendEmailVerification(formData);

      setSuccess(response.data?.message);
    } catch (error) {
      setSuccess(null);
      setError(error);
      console.error("Error resending verification email:", error);
    } finally {
      reset();
    }
  };

  console.log("Rendering ResendVerificationEmail component success:", success);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">{`${success}`}</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
        <Button onClick={() => reset()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader className="text-center">
        <CardTitle>Resend Verification Email</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
        <CardContent className="space-y-6">
          <div className="grid gap-4"> 
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? "Sending..." : "Resend Email"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResendVerificationEmail;
