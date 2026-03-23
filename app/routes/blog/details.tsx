import type { Route } from "./+types/details";
import type { Post, StrapiResponse, StrapiPost } from "~/types";
import Markdown from "react-markdown";
import { Link } from "react-router";

export async function loader({
  request,
  params,
}: Route.LoaderArgs): Promise<{ post: Post }> {
  const { slug } = params;

  // Get the individual blog post
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?filters[slug][$eq]=${slug}&populate=image`,
  );
  if (!res.ok) throw new Error("Failed to fetch data");

  const json: StrapiResponse<StrapiPost> = await res.json();
  if (!json.data.length) throw new Response("Not found", { status: 404 });

  const strapiPost = json.data[0];
  const post = {
    id: strapiPost.id,
    documentId: strapiPost.documentId,
    title: strapiPost.title,
    slug: strapiPost.slug,
    excerpt: strapiPost.excerpt,
    body: strapiPost.body,
    date: strapiPost.date,
    image: strapiPost.image?.url
      ? `${strapiPost.image.url}`
      : "images/no-image.png",
  };

  return { post };
}

function BlogPostDetailsPage({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {new Date(post.date).toDateString()}
      </p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <div className="max-w-none mb-12 prose prose-invert">
        <Markdown>{post.body}</Markdown>
      </div>

      <Link
        to="/blog"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ⬅ Back To Posts
      </Link>
    </div>
  );
}

export default BlogPostDetailsPage;
