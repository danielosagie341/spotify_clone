"use client"
import * as RadixSlider from "@radix-ui/react-slider"

interface sliderProps {
    value?: number;
    onChange?: (value: number) => void;
    max?: number;
}

const Slider: React.FC<sliderProps> = ({ value = 1, onChange, max }) => {
    
    const handleChange = (newValue: number[]) => { 
        onChange?.(newValue[0])
    }

    return ( 
        <RadixSlider.Root className="relative flex items-center select-none touch-none w-full h-10"  defaultValue={[1]} value={[value]} onValueChange={handleChange} max={max} step={0.1} aria-label="volume">
            <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
                <RadixSlider.Range className="absolute bg-white rounded-full h-full">

                </RadixSlider.Range>
            </RadixSlider.Track>

        </RadixSlider.Root>
     );
}
 
export default Slider;