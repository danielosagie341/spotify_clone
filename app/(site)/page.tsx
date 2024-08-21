import getSongs from "@/actions/getSongs";
import getLikedSongs from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";
import useOnPlay from "@/hooks/useOnPlay";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-y-auto overflow-hidden">
      <Header>
        <div className="mb-2">
          <h1 className=" text-white text-3xl font-semibold">
             Welcome Back {/* {user?.user_metadata.full_name ? user?.user_metadata.full_name : user?.user_metadata.user_name} */}
          </h1>
          
          <div className="grid grid-clos-1 sm:grid-clos-2 xl:grid-clos-3 2xl:grid-clos-4 gap-3 mt-4 w-[300px]">
            <ListItem name="Liked Songs" href="/liked" image="/images/liked.jpg" />
          </div>
      </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest Songs
          </h1>
        </div>
        <PageContent songs={songs} />
      </div>
   </div>
  )
}
