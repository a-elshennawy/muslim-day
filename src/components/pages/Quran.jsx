import { FaCopy } from "react-icons/fa";
import {
  IoCheckmarkCircleSharp,
  IoHomeOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { MdGTranslate } from "react-icons/md";
import { useState, use, Suspense, useEffect } from "react";
import LoadingSpinner from "../reusableComponents/LoadingSpinner";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

async function fetchAyat() {
  const res = await fetch("/API/quran_en.json");
  const data = await res.json();
  return data;
}

const ayatPromise = fetchAyat();

export default function Quran() {
  const [ayah, setAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const ayat = use(ayatPromise);

  const randomAyah = () => {
    const randomSurahIndex = Math.floor(Math.random() * ayat.length);
    const randomSurah = ayat[randomSurahIndex];

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

  const toggleLang = () => {
    setShowTranslation(!showTranslation);
  };

  useEffect(() => {
    randomAyah();
  }, []);

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

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <button className="homeBtn">
          <Link to={"/"}>
            <IoHomeOutline />
          </Link>
        </button>
        <section className="container-fluid row justify-content-center align-items-center m-0">
          <div className="quranCard row justify-content-center align-items-center m-0 col-lg-5 col-11 text-center">
            <div className="ayahText col-12">
              {ayah ? (
                showTranslation ? (
                  <div>
                    <h4 className="mb-1 mt-0">{ayah.verse.translation}</h4>
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
              <button onClick={toggleLang}>
                <MdGTranslate />
              </button>
              <button onClick={randomAyah}>
                <IoRefreshOutline />
              </button>
              <button onClick={handleCopy}>
                <FaCopy />
              </button>
            </div>
          </div>
        </section>

        {showNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1001,
            }}
            className="shareNotification"
          >
            {showTranslation ? "Ayah copied" : "تم نسخ الايه"}&nbsp;
            <IoCheckmarkCircleSharp />
          </motion.div>
        )}
      </Suspense>
    </>
  );
}
