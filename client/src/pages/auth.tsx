import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // ユーザーが既にログインしている場合はダッシュボードにリダイレクト
  if (session) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {activeTab === "login" ? "ログイン" : "アカウント登録"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="register">新規登録</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
