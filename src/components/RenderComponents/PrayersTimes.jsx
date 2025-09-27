export default function PrayersTimes({ prayerData }) {
  const formatPrayerTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const numHours = parseInt(hours);
    const AmPm = numHours >= 12 ? "PM" : "AM";
    const formattedHours = numHours % 12 || 12;
    return `${formattedHours}:${minutes} ${AmPm}`;
  };

  const prayerIcons = [
    "img/icons8-dawn-16.png",
    "img/icons8-sunrise-16.png",
    "img/icons8-midday-16.png",
    "img/icons8-afternoon-16.png",
    "img/icons8-sunset-16.png",
    "img/icons8-night-16.png",
  ];

  const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  return (
    <>
      <div className="prayer-times col-12">
        <div
          id="prayer"
          className="prayer-container gap-2 row justify-content-center align-items-center text-center"
        >
          {prayers.map((prayer, index) => (
            <div key={prayer} className="prayerItem col-5 col-lg-1">
              <img src={prayerIcons[index]} alt={prayer} /> {prayer}
              <br />
              {formatPrayerTime(prayerData.timings[prayer])}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
