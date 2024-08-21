"use client"

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import uniqid from "uniqid";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const AuthModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { onClose, isOpen } = useUploadModal()
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            Image: null,
        }
    })

    
    const onChange = (open: boolean) => { 
        if (!open) { 
            reset();
            onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => { 
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            if (!imageFile || !songFile || !user) { 
                toast.error('Missing fields');
                return;
            }

            const uniqueID = uniqid();

            // upload song

            const { data: songData, error: songError } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
                cacheControl: '3600',
                upsert: false,
            });

            if (songError) { 
                setIsLoading(false)
                toast.error('Error uploading song');
            }

            //upload image
            
            const { data: imageData, error: imageError } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
                cacheControl: '3600',
                upsert: false,
            });

            if (imageError) { 
                setIsLoading(false)
                toast.error('Error uploading image');
            }

            //after uploading make query
            const { error: supabaseError } = await supabaseClient.from('songs').insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData?.path,
                song_path: songData?.path,
            })

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message)
            }

            router.refresh();
            setIsLoading(false)
            toast.success('Song created');
            reset();
            onClose();
           
        } catch (err) {
            toast.error("something went wrong")
        } finally { 
            setIsLoading(false)
        }
    }

    return ( 
        <Modal title="Add a song" description="upload an mp3 file" isOpen={isOpen} onChange={onChange}>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} {...register('title', { required: true })} placeholder='song title' />
                
                <Input id="author" disabled={isLoading} {...register('author', { required: true })} placeholder='song author' />

                <div>
                    <p className="pb-1">select a song file</p>
                    <Input id="song" type="file" accept=".mp3" disabled={isLoading} {...register('song', { required: true })} />
                </div>
            
                <div>
                    <p className="pb-1">select a cover art</p>
                    <Input id="image" type="file" accept="image/*" disabled={isLoading} {...register('image', { required: true })} />
                </div>

                <Button disabled={isLoading} type="submit">
                    Create
                </Button>

           </form>
        </Modal>
     );
}
 
export default AuthModal; 