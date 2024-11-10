export const AskAI = async (transcript, prompt) => {
  console.log("testss", transcript, prompt);
  const { available, defaultTemperature, defaultTopK, maxTopK } =
    await window?.ai?.languageModel?.capabilities();

  if (available !== "no") {
    const session = await window?.ai?.languageModel.create({
      systemPrompt: transcript,
    });

    // Prompt the model and wait for the whole result to come back.
    const result = await session?.prompt(prompt);
    console.log(result);
    return result;
  } else {
    console.log("Failed to initialize prompt AI");
  }
};
