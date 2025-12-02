import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Framework from "@/pages/framework";
import Journal from "@/pages/journal";
import JournalPost from "@/pages/journal-post";
import About from "@/pages/about";
import Login from "@/pages/login";
import ResetPassword from "@/pages/reset-password";
import AdminEditor from "@/pages/admin-editor";
import SavedChats from "@/pages/saved-chats";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/framework" component={Framework} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:id" component={JournalPost} />
      <Route path="/about" component={About} />
      <Route path="/login/editor" component={Login} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/admin/journal" component={AdminEditor} />
      <Route path="/admin/chats" component={SavedChats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Toaster />
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
