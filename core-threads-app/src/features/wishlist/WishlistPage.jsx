import { MainNavbar } from "../../components/MainNavbar";
import { Marquee } from "../../components/Marquee";
import WishlistSection from "./components/WishlistSection";

function WishlistPage() {
  return (
    <>
      <Marquee />
      <MainNavbar />
      <WishlistSection />
    </>
  );
}

export default WishlistPage;
