import { useState, useEffect } from "react";
import CurrentTime from "../RenderComponents/CurrentTime";
import Date from "../RenderComponents/Date";
import PrayersTimes from "../RenderComponents/PrayersTimes";
import Quran from "../RenderComponents/Quran";
import LoadingSpinner from "../reusableComponents/LoadingSpinner";

export default function Home() {
  const [prayerData, setPrayerData] = useState(null);
  const [hijriDate, setHijriDate] = useState("");
  const [miladiDate, setMiladiDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Get user location
  const getUserLocation = async () => {
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await getPrayerData(lat, lon);
            resolve();
          },
          async () => {
            await getPrayerData(30.0444, 31.2357); // Cairo coordinates as fallback
            resolve();
          }
        );
      });
    } else {
      await getPrayerData(30.0444, 31.2357); // Cairo coordinates as fallback
    }
  };

  // Get prayer data
  const getPrayerData = async (lat, lon) => {
    try {
      setLoading(true);
      const prayerResponse = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
      );
      const prayerData = await prayerResponse.json();
      setPrayerData(prayerData.data);
      setHijriDate(prayerData.data.date.hijri);
      setMiladiDate(prayerData.data.date.gregorian);
    } catch (err) {
      console.log("Error fetching prayer data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      await getUserLocation();
    };
    initApp();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="mainApp container-fluid row justify-content-center align-items-center text-center m-0">
        <Quran />
        <CurrentTime />
        <Date hijriDate={hijriDate} miladiDate={miladiDate} />
        {prayerData && <PrayersTimes prayerData={prayerData} />}
      </section>
    </>
  );
}
