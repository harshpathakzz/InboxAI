"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import useEmailStore from "@/stores/useEmailStore";
import axios from "axios";
import useApiKeyStore from "@/stores/useApiKeyStore";
import { toast } from "sonner";

interface Email {
  id: string;
  subject: string;
  snippet: string;
  body: string;
}

const ClassificationButton: React.FC = () => {
  const { emails, updateClassification } = useEmailStore();
  const { apiKey: storedApiKey } = useApiKeyStore();

  const handleClassification = async () => {
    if (!storedApiKey) {
      toast.warning("Please enter your API key to continue.");
      return;
    }

    try {
      const results = await Promise.allSettled(
        emails.map(async (email: Email) => {
          const requestBody = {
            id: email.id,
            apiKey: storedApiKey,
            emailContent: JSON.stringify({
              subject: email.subject,
              snippet: email.snippet,
              body: email.body,
            }),
          };

          const response = await axios.post(
            "http://localhost:5000/ai/classify-email",
            requestBody
          );
          const data = response.data;
          const result = JSON.parse(data.classification);
          updateClassification(email.id, result.classify);
          return { email, success: true };
        })
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled" && result.value?.success
      ).length;
      const failureCount = results.length - successCount;

      if (failureCount > 0) {
        toast.error(`${failureCount} email(s) failed to classify.`);
      }
      if (successCount > 0) {
        toast.success(`${successCount} email(s) classified successfully.`);
      }
    } catch (error) {
      console.error("Error classifying emails:", error);
      toast.error("Error classifying emails");
    }
  };

  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={handleClassification}
    >
      Classify
    </Button>
  );
};

export default ClassificationButton;
