import { FaCopy } from "react-icons/fa";
import { IoCheckmarkCircleSharp, IoRefreshOutline } from "react-icons/io5";
import { MdGTranslate } from "react-icons/md";
import { useState, useEffect } from "react";
import LoadingSpinner from "../reusableComponents/LoadingSpinner";
import { motion } from "motion/react";

export default function Quran() {
  const [ayah, setAyah] = useState(null);
  const [ayat, setAyat] = useState(null); // Store the fetched data
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchAyat() {
      try {
        const res = await fetch("/API/quran_en.json");
        const data = await res.json();
        setAyat(data);
        // Set initial random ayah
        randomAyahFromData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Quran data:", error);
        setLoading(false);
      }
    }
    fetchAyat();
  }, []);

  const randomAyahFromData = (data) => {
    if (!data || data.length === 0) return;

    const randomSurahIndex = Math.floor(Math.random() * data.length);
    const randomSurah = data[randomSurahIndex];

    const randomVerseIndex = Math.floor(
      Math.random() * randomSurah.verses.length
    );
    const randomVerse = randomSurah.verses[randomVerseIndex];

    setAyah({
      surahName: randomSurah.name,
      surahTransliteration: randomSurah.transliteration,
      verse: randomVerse,
    });
  };

  const randomAyah = () => {
    randomAyahFromData(ayat);
  };

  const toggleLang = () => {
    setShowTranslation(!showTranslation);
  };

  const handleCopy = () => {
    const ayahText = showTranslation ? ayah.verse.translation : ayah.verse.text;
    navigator.clipboard
      .writeText(ayahText)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch((err) => {
        console.error("failed to copy ayah :", err);
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="quranCard row justify-content-center align-items-center m-0 col-lg-5 col-11 text-center">
        <div className="ayahText col-12">
          {ayah ? (
            showTranslation ? (
              <div>
                <h4 className="mb-1 mt-0" data-testid="translatedAyah">
                  {ayah.verse.translation}
                </h4>
                <h5 className="mt-3 mb-0">
                  Surat {ayah.surahTransliteration} - {ayah.verse.id}
                </h5>
              </div>
            ) : (
              <div>
                <h4 className="mb-1 mt-0">{ayah.verse.text}</h4>
                <h5 className="mt-3 mb-0">
                  سورة {ayah.surahName} - {ayah.verse.id}
                </h5>
              </div>
            )
          ) : (
            <h4>Loading...</h4>
          )}
        </div>
        <div className="actionsArea col-12">
          <button onClick={toggleLang} data-testid="translationBtn">
            <MdGTranslate />
          </button>
          <button onClick={randomAyah} data-testid="randomAyahBtn">
            <IoRefreshOutline />
          </button>
          <button onClick={handleCopy} data-testid="copyBtn">
            <FaCopy />
          </button>
        </div>
      </div>

      {showNotification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1001,
          }}
          className="shareNotification col-5 col-lg-1"
          data-testid="shareNotification"
        >
          {showTranslation ? "Ayah copied" : "تم نسخ الايه"}&nbsp;
          <IoCheckmarkCircleSharp />
        </motion.div>
      )}
    </>
  );
}
