"use client"
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types"

interface searchContentProps {
    songs: Song[];
    searchParams: {
        title: string;
    };
}

const SearchContent: React.FC<searchContentProps> = ({ songs, searchParams }) => {
    const onPlay = useOnPlay(songs);
    if (searchParams.title === '') { 
        return (
           <div className="flex flex-col gap-y-2 w-full pt-10 px-6 text-neutral-400">Do Something With This Later Like Display All Those Categories On The Actual Spotify.</div> 
        )
    }
    
    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No Songs Found.</div>
        )
    }

  return (
      songs.map((item) => (
          <div key={item.id} className="flex items-center gap-x-4 w-full">
                <div className="flex-1">
                    <MediaItem data={item} onClick={(id:string) => onPlay(id)} />
              </div>
              <LikeButton songId={item.id} />
          </div>
      ))
  )
}

export default SearchContent