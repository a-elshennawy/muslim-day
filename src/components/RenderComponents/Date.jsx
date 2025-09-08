import { BsFillCalendarDateFill } from "react-icons/bs";

export default function Date({ hijriDate, miladiDate }) {
  return (
    <>
      <div className="dates col-12 row gap-1 justify-content-center align-items-center text-center">
        {hijriDate && (
          <div id="hijriDate" className="col-12 col-lg-3 py-1 dateItem">
            <BsFillCalendarDateFill />
            {`${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`}
          </div>
        )}
        {miladiDate && (
          <div id="miladiDate" className="col-12 col-lg-3 py-1 dateItem">
            <BsFillCalendarDateFill />
            {`${miladiDate.day} ${miladiDate.month.en} ${miladiDate.year}`}
          </div>
        )}
      </div>
    </>
  );
}
