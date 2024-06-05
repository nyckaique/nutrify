interface LogoProps {
  expanded: boolean;
}
import logoImg from "../assets/logo-nutrify.png";

export default function Logo({ expanded }: LogoProps) {
  return (
    <div className="container-flex-col items-center">
      <img
        src={logoImg}
        alt="Nutrify logo"
        className={` ${expanded ? "w-[60px]" : "w-[40px]"} h-auto`}
      />
      <h1
        className={`font-bold text-orange ${expanded ? "text-4xl" : "hidden"} `}
      >
        Nutrify
      </h1>
    </div>
  );
}
