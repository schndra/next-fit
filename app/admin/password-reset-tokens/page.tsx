"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Key, Clock, Mail } from "lucide-react";
import { toast } from "sonner";

interface PasswordResetToken {
  email: string;
  token: string;
  timestamp: string;
  expiresAt: string;
}

export default function PasswordResetTokensPage() {
  const [tokens, setTokens] = useState<PasswordResetToken[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/password-reset-tokens");

      if (!response.ok) {
        throw new Error("Failed to fetch tokens");
      }

      const data = await response.json();
      setTokens(data.tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      toast.error("Failed to fetch password reset tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const isExpired = (expiresAt: string) => {
    return new Date() > new Date(expiresAt);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Password Reset Tokens</h1>
          <p className="text-muted-foreground">
            View password reset tokens for testing (Development Only)
          </p>
        </div>
        <Button onClick={fetchTokens} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Reset Tokens</h3>
            <p className="text-muted-foreground">
              No password reset tokens have been generated yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tokens.map((token, index) => (
            <Card
              key={index}
              className={isExpired(token.expiresAt) ? "opacity-60" : ""}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {token.email}
                  </CardTitle>
                  <Badge
                    variant={
                      isExpired(token.expiresAt) ? "secondary" : "default"
                    }
                  >
                    {isExpired(token.expiresAt) ? "Expired" : "Active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reset Token
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                      {token.token}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(token.token)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Generated At
                    </label>
                    <p className="mt-1">
                      {new Date(token.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires At
                    </label>
                    <p className="mt-1">
                      {new Date(token.expiresAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(
                        `http://localhost:3001/reset-password?token=${token.token}`
                      )
                    }
                    className="w-full"
                  >
                    Copy Reset Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
