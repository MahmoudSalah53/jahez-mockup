import { HomeMobile } from "@/components/home/HomeMobile";
import { HomeDesktop } from "@/components/home/HomeDesktop";

export default function HomePage() {
  return (
    <>
      <div className="md:hidden">
        <HomeMobile />
      </div>
      <div className="hidden md:block">
        <HomeDesktop />
      </div>
    </>
  );
}
