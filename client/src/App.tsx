import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Framework from "@/pages/framework";
import Journal from "@/pages/journal";
import JournalPost from "@/pages/journal-post";
import About from "@/pages/about";
import Login from "@/pages/login";
import AdminEditor from "@/pages/admin-editor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/framework" component={Framework} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:id" component={JournalPost} />
      <Route path="/about" component={About} />
      <Route path="/login/:type" component={Login} />
      <Route path="/admin/journal" component={AdminEditor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
