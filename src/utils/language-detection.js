export const LanguageDetector = async (userText) => {
  const canDetect = await window?.translation?.canDetect();
  let detector;
  if (canDetect !== "no") {
    if (canDetect === "readily") {
      // The language detector can immediately be used.
      detector = await window?.translation?.createDetector();
    } else {
      // The language detector can be used after the model download.
      detector = await window?.translation?.createDetector();
      detector.addEventListener("downloadprogress", (e) => {
        console.log("Loaded", e?.loaded, e?.total);
      });
      await detector?.ready;
    }
  } else {
    // The language detector can't be used at all.
    alert("Unable to detect user Language");
    return;
  }

  const results = await detector?.detect(userText);
  if (results?.length > 0) {
    const highestConfidence = results?.reduce((max, obj) => {
      return obj?.confidence > max?.confidence ? obj : max;
    });

    return highestConfidence;
  }
};
