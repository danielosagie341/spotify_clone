"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
    image: string;
    name: string;
    href: string;
}

const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
    

  return (
      <Link href={href} onClick={() => onclick} className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4">
          <div className="relative min-h-[64px] min-w-[64px]">
              <Image className="object-cover" fill src={image} alt="Image" />
          </div>

          <p>{name}</p>

          <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-110">
              <FaPlay className="text-black" />
          </div>
    </Link>
  )
}

export default ListItem