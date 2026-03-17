import type { Route } from "./+types/details";
import type { Project, StrapiProject, StrapiResponse } from "~/types";
import { Link } from "react-router";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export async function loader({ request, params }: Route.LoaderArgs) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/projects?filters[documentId][$eq]=${params.id}&populate=*`,
  );
  // const res = await fetch(
  //   `${import.meta.env.VITE_API_URL}/projects/${params.id}?populate=*`,
  // );

  if (!res.ok) throw new Response("Project not found", { status: 404 });
  const json: StrapiResponse<StrapiProject> = await res.json();
  // const json: { data: StrapiProject } = await res.json();

  const project: Project = {
    id: json.data[0].id,
    documentId: json.data[0].documentId,
    title: json.data[0].title,
    description: json.data[0].description,
    featured: json.data[0].featured,
    date: json.data[0].date,
    category: json.data[0].category,
    url: json.data[0].url,
    image: json.data[0].image?.url
      ? `${import.meta.env.VITE_STRAPI_URL}${json.data[0].image.url}`
      : "images/no-image.png",
  };
  // const project: Project = {
  //   id: json.data.id,
  //   documentId: json.data.documentId,
  //   title: json.data.title,
  //   description: json.data.description,
  //   featured: json.data.featured,
  //   date: json.data.date,
  //   category: json.data.category,
  //   url: json.data.url,
  //   image: json.data.image?.url
  //     ? `${import.meta.env.VITE_STRAPI_URL}${json.data.image.url}`
  //     : "images/no-image.png",
  // };

  return project;
}

function ProjectDetailsPage({ loaderData }: Route.ComponentProps) {
  const project = loaderData;
  return (
    <>
      <Link
        to="/projects"
        className="flex items-center text-blue-400 hover:text-blue-500 transition mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back To Projects
      </Link>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div>
          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-blue-400 mb-4">
            {project.title}
          </h1>
          <p className="text-gray-300 text-sm mb-4">
            {new Date(project.date).toLocaleDateString()} &middot;{" "}
            {project.category}
          </p>
          <p className="text-gray-200 mb-6">{project.description}</p>
          <a
            href={project.url}
            target="_blank"
            className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
          >
            View Live Site <FaArrowRight className="inline" />
          </a>
        </div>
      </div>
    </>
  );
}

export default ProjectDetailsPage;
