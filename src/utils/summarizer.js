export const TextSummarizer = async (userText) => {
  const canSummarize = await window?.ai?.summarizer.capabilities();
  let summarizer;
  if (canSummarize && canSummarize?.available !== "no") {
    if (canSummarize?.available === "readily") {
      // The summarizer can immediately be used.
      summarizer = await window?.ai?.summarizer?.create();
    } else {
      // The summarizer can be used after the model download.
      summarizer = await window?.ai.summarizer?.create();
      summarizer?.addEventListener("downloadprogress", (e) => {
        console.log(e?.loaded, e?.total);
      });
      await summarizer?.ready;
    }
  } else {
    alert("Unable to summarize.");
    return "";
  }

  if (userText) {
    const result = await summarizer?.summarize(userText);
    summarizer?.destroy();
    return result;
  } else {
    alert("Transcript is not available.");
  }
};
