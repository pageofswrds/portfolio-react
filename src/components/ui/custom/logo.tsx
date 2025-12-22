import Image from "next/image";
import Link from "next/link";

export default function Logo({ isInverted = false }: { isInverted?: boolean }) {
  let logoSrc = "/logo.svg";

  if (isInverted) {
    logoSrc = "/logo-invert.svg";
  }

  return (
    <Link href="/">
      <Image
        src={logoSrc}
        width={128}
        height={128}
        alt="Partial asterisk logo"
      />
    </Link>
  );
}
