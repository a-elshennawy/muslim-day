import { ClipLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <>
      <div className="loader">
        <ClipLoader speedMultiplier={1} color="#fff" />
      </div>
    </>
  );
}
