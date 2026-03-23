import type { Route } from "./+types/index";
import type {
  Project,
  Post,
  StrapiPost,
  StrapiProject,
  StrapiResponse,
} from "~/types";
import FeaturedProjects from "~/components/FeaturedProjects";
import AboutPreview from "~/components/AboutPreview";
import LatestBlogPosts from "~/components/LatestBlogPosts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Friendly Dev | Welcome" },
    { name: "description", content: "Custom website development" },
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: Post[]; projects: Project[] }> {
  const [postRes, projectRes] = await Promise.all([
    fetch(
      `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`,
    ),
    fetch(
      `${import.meta.env.VITE_API_URL}/projects?filters[featured][$eq]=true&populate=*`,
    ),
  ]);

  if (!postRes.ok || !projectRes.ok)
    throw new Error("Failed to fetch posts or projects.");

  const [postJson, projectJson]: [
    StrapiResponse<StrapiPost>,
    StrapiResponse<StrapiProject>,
  ] = await Promise.all([postRes.json(), projectRes.json()]);

  const projects = projectJson.data.map((project: StrapiProject) => ({
    id: project.id,
    documentId: project.documentId,
    title: project.title,
    description: project.description,
    featured: project.featured,
    date: project.date,
    category: project.category,
    url: project.url,
    image: project.image?.url ? `${project.image.url}` : "images/no-image.png",
  }));

  const posts = postJson.data.map((item: StrapiPost) => ({
    id: item.id,
    documentId: item.documentId,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    date: item.date,
    image: item.image?.url ? `${item.image.url}` : "images/no-image.png",
  }));

  return { posts, projects };
}

function HomePage({ loaderData }: Route.ComponentProps) {
  const { posts, projects } = loaderData;

  return (
    <>
      <FeaturedProjects projects={projects} count={2} />
      <AboutPreview />
      <LatestBlogPosts posts={posts} />
    </>
  );
}

export default HomePage;
