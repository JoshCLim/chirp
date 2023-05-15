import type { RouterOutputs } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-4 border-b border-slate-400 p-8">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username} profile`}
        className="h-10 w-10 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 font-light text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span>{`·`}</span>
          <Link href={`/post/${post.id}`}>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};
