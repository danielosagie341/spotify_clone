"use client"

import useSound from "use-sound";
import { Song } from "@/types"
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import { useEffect, useState } from "react";
import usePlayer from "@/hooks/usePlayer";

interface playerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<playerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0);
  const Icon = isPlaying ? BsPauseFill : BsPlayFill
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => { 
    if (player.ids.length === 0) {
      return;
    }

    const currentSong = player.ids.findIndex((id) => id === player.activeId)
    const nextSong = player.ids[currentSong + 1]

    if (!nextSong) { 
      return player.setId(player.ids[0])
    }

    player.setId(nextSong)
  }

  const onPlayPrevious = () => { 
    if (player.ids.length === 0) {
      return;
    }

    const currentSong = player.ids.findIndex((id) => id === player.activeId)
    const previousSong = player.ids[currentSong - 1]

    if (!previousSong) { 
      return player.setId(player.ids[player.ids.length - 1])
    }

    player.setId(previousSong)
  }

  const [play, { pause, sound }] = useSound(
    songUrl,
    {
      volume: volume,
      position: currentTime, 
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3']
    }
  )

  useEffect(() => {
    sound?.play();
  
    return () => {
      sound?.unload();
    }
  }, [sound])

  const handlePlay = () => { 
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }

  const toggleVolume = () => { 
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0)
    }
  }
  
  useEffect(() => {
  if (sound) {
    sound.seek(currentTime);
  }
  }, [sound, currentTime]);

useEffect(() => {
  let animationFrameId = 0
  let lastUpdateTime = 0;
  const updateInterval = 1000; 

  const updateCurrentTime = () => {
    const now = performance.now();

    if (now - lastUpdateTime >= updateInterval) {
      if (sound) {
        setCurrentTime(sound.seek());
      }

      lastUpdateTime = now;
    }

    animationFrameId = requestAnimationFrame(updateCurrentTime);
  };

  if (isPlaying) {
    animationFrameId = requestAnimationFrame(updateCurrentTime);
  }

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}, [isPlaying, sound]);

const handleSliderChange = (value: number) => {
  setCurrentTime(value);

  if (sound) {
    sound.seek(value);
  }
};



  return (
    <div className=" h-full flex justify-between">
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} />
            <LikeButton songId={song.id} />
          </div>
        </div>

        <div 
          className="
            flex 
            flex-col
            items-end
            md:hidden 
            col-auto 
            w-[60%] 
            justify-center
          "
        >
          <div 
            onClick={handlePlay} 
            className="
              h-10
              w-10
              flex 
              items-center 
              justify-center 
              rounded-full 
              bg-white 
              p-1 
              cursor-pointer
            "
          >
          <Icon size={30} className="text-black" />
          
          
        </div>
        
        <Slider
            value={currentTime}
            max={sound?._duration} 
            onChange={(value) => handleSliderChange(value)}
          />
        </div>

      <div className="flex flex-col h-full">
          <div 
          className="
            hidden
            h-full
            md:flex 
            justify-center 
            items-center 
            w-full 
            max-w-[722px] 
            gap-x-6
          "
        >
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
          />
          <div 
            onClick={handlePlay} 
            className="
              flex 
              items-center 
              justify-center
              h-10
              w-10 
              rounded-full 
              bg-white 
              p-1 
              cursor-pointer
            "
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            " 
          />
      </div>
      
       <Slider
            value={currentTime}
            max={sound?._duration} 
            onChange={(value) => handleSliderChange(value)}
          />
      </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon 
              onClick={toggleVolume} 
              className="cursor-pointer" 
              size={34} 
          />

          <Slider 
            value={volume} 
          onChange={(value) => setVolume(value)}
          max={1}
          />
          </div>
        </div>

      </div>

  )
}

export default PlayerContent