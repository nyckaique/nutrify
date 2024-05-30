interface PagetitleProps {
  titulo: string;
}
export default function Pagetitle({ titulo }: PagetitleProps) {
  return <h1 className="text-orange text-3xl font-bold">{titulo}</h1>;
}
