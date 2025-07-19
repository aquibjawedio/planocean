import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { resetPasswordSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@radix-ui/react-label";
const ResetPasswordForm = () => {
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfPassword, setHideConfPassword] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (formData) => {
    console.log("Form Data : ", formData);
  };

  return (
    <Card className="mx-auto max-w-sm w-full py-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {/* New Password will be here  */}
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative space-y-1">
                <Input
                  id="new-password"
                  type={hideNewPassword ? "password" : "text"}
                  required
                  {...register("newPassword")}
                  placeholder="Enter your new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setHideNewPassword(!hideNewPassword)}
                  className="absolute right-0  top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {hideNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
            {/* Confirm New Password Will be there */}
            <div className="grid gap-2">
              <Label htmlFor="conf-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="conf-password"
                  type={hideConfPassword ? "password" : "text"}
                  required
                  {...register("confirmPassword")}
                  placeholder="Enter your new password again"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setHideConfPassword(!hideConfPassword)}
                  className="absolute right-0  top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {hideConfPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Reset Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
