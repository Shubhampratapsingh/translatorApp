export const TranscriptTranslator = async (transcript, languageCode) => {
  const languagePair = {
    sourceLanguage: languageCode?.sourceLanguage,
    targetLanguage: languageCode?.targetLanguage,
  };

  const canTranslate = await window?.translation?.canTranslate(languagePair);
  let translator;
  if (canTranslate !== "no") {
    if (canTranslate === "readily") {
      // The translator can immediately be used.
      translator = await window?.translation?.createTranslator(languagePair);
    } else {
      // The translator can be used after the model download.
      translator = await window?.translation?.createTranslator(languagePair);
      translator?.addEventListener("downloadprogress", (e) => {
        console.log(e?.loaded, e?.total);
      });
      await translator?.ready;
    }
  } else {
    alert("Error occured while translating the transcript");
    return;
  }

  if (transcript) {
    const translation = await window?.translator?.translate(transcript);
    console.log("js file test", transcript, translation, languageCode);
    if (translation) {
      return translation;
    }
  }
};
