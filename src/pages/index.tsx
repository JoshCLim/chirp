import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { PostView } from "~/components/postView";
import { type NextPage } from "next";

import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0]);
      else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <UserButton />
      {/* <img
        src={user.profileImageUrl}
        alt="Profile Img"
        className="h-14 w-14 rounded-full"
      /> */}
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        onChange={(e) => setInput(e.target.value)}
        type="text"
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") mutate({ content: input });
        }}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong...</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div></div>;

  return (
    <>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full overflow-y-scroll border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && <SignInButton />}
            {!!isSignedIn && <CreatePostWizard />}
            {/* <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <h1>Sign in</h1>
              <SignInButton mode="modal" />
            </SignedOut> */}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
