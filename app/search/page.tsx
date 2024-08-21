import getSongsBtTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";

interface searchProps {
    searchParams: {
        title: string;
    }
}

const Search = async ({ searchParams }: searchProps) => {
    const songs = await getSongsBtTitle(searchParams.title);

    

  return (
      <div className="bg-neutral-900 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
          <Header className="from-bg-neutral-900">
              <div className="mb-2 flex flex-col gap-y-6">
                  <h1 className="text-white text-3xl font-semibold">
                      Search
                      <SearchInput />
                  </h1>
              </div>
              <SearchContent searchParams={searchParams} songs={songs} />
          </Header>
    </div>
  )
}

export default Search