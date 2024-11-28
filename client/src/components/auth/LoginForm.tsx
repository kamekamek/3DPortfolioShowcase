import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../../lib/auth/auth";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";

export default function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const { error } = await login(data);
      if (error) {
        throw error;
      }
      toast({
        title: "ログイン成功",
        description: "ホーム画面にリダイレクトします",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message || "ログインに失敗しました",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? "非表示" : "表示"}
              </button>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>
    </Form>
  );
}
