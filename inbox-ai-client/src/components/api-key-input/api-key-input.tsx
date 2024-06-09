"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const [storedApiKey, setStoredApiKey] = useLocalStorage("apiKey", "");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setApiKey(storedApiKey);
  }, [storedApiKey]);

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div className="flex items-center">
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogTrigger asChild>
          <Button onClick={() => setShowDialog(true)}>Key</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter API Key</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                type="text"
                placeholder="OpenAI API Key"
                className="w-full"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApiKeyInput;
