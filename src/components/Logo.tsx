interface LogoProps {
  expanded: boolean;
}
export default function Logo({ expanded }: LogoProps) {
  return (
    <div className="container-flex-col items-center">
      <img
        src="src\assets\logo-nutrify.png"
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
