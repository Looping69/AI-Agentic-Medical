import { useState } from "react";
import { useSimpleAuth } from "@/lib/simple-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SimpleLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, skipLogin } = useSimpleAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);

    if (!success) {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    skipLogin();
    toast({
      title: "Authentication Skipped",
      description: "You are now logged in as a guest",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">LENY-AI Medical</h1>
          <p className="text-gray-600 mt-2">Admin Authentication</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-primary"
            >
              Skip Authentication
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Admin credentials for development purposes only.</p>
          <p className="mt-1">
            For production, use secure authentication methods.
          </p>
        </div>
      </div>
    </div>
  );
}
