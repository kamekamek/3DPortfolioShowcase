import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route, useLocation } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard";
import AuthPage from "./pages/auth";

// 認証が必要なルートを保護するためのコンポーネント
function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { session, loading } = useAuth();
  const [, navigate] = useLocation();

  // 認証状態の読み込み中は何も表示しない
  if (loading) {
    return null;
  }

  // 未認証の場合は認証ページにリダイレクト
  if (!session) {
    navigate("/auth");
    return null;
  }

  return <Component />;
}

function Router() {
  const { session, loading } = useAuth();
  const [, navigate] = useLocation();

  // 初回読み込み時に認証状態をチェックし、未認証の場合は/authにリダイレクト
  if (!loading && !session) {
    navigate("/auth");
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} />
      </Route>
      <Route>404 Page Not Found</Route>
    </Switch>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
