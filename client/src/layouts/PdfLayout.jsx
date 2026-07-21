import { Outlet } from "react-router-dom";
import PdfNavbar from "../components/PdfNavbar";

const PdfLayout = () => {
  return (
    <div className="flex flex-col h-full">


      {/* PDF Navigation */}
      <PdfNavbar />

      {/* Current PDF Feature */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default PdfLayout;