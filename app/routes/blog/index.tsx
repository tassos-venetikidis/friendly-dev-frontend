import { useState } from "react";
import Pagination from "~/components/Pagination";
import PostFilter from "~/components/PostFilter";
import type { Route } from "./+types/index";
import type { Post, StrapiPost, StrapiResponse } from "~/types";
import PostCard from "~/components/PostCard";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`,
  );

  if (!res.ok) throw new Error("Failed to fetch data");

  const json: StrapiResponse<StrapiPost> = await res.json();

  const posts = json.data.map((item: StrapiPost) => ({
    id: item.id,
    documentId: item.documentId,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    date: item.date,
    image: item.image?.url ? `${item.image.url}` : "images/no-image.png",
  }));

  return { posts };
}

function BlogPage({ loaderData }: Route.ComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTerm, setFilterTerm] = useState("");

  const { posts } = loaderData;

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(filterTerm) ||
      post.excerpt.toLowerCase().includes(filterTerm),
  );

  // Pagination Calculations
  const postPerPage = 3;
  const totalPages = Math.ceil(filteredPosts.length / postPerPage);
  const indexOfFirst = currentPage * postPerPage - postPerPage;
  const indexOfLast = currentPage * postPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  function handleOnFilterInput(term: string) {
    setFilterTerm(term);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900">
        <h2 className="text-3xl font-bold mb-8">📝 Blog</h2>
        <PostFilter
          filterTerm={filterTerm}
          onFilterInput={handleOnFilterInput}
        />
        <div className="space-y-8">
          {!currentPosts.length ? (
            <p className="text-gray-400 text-center">No Posts Found</p>
          ) : (
            currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default BlogPage;
