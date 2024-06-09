import OpenAI from "openai";

const classifyEmailContent = async (apiKey, emailContent) => {
  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          'You are a color classifier. You should return a JSON response with the following format: [{"is_primary": true/false}]',
      },
      { role: "user", content: emailContent },
    ],
    max_tokens: 300,
    response_format: { type: "json_object" },
  });
  const classification = completion.choices[0].message.content.trim();
  return classification;
};

export const classifyEmail = async (req, res) => {
  try {
    const { apiKey, emailContent } = req.body;

    // Validate the API key
    if (!apiKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Call the email classification service
    const classificationResult = await classifyEmailContent(
      apiKey,
      emailContent
    );

    return res.status(200).json({ classification: classificationResult });
  } catch (error) {
    console.error("Error classifying email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
