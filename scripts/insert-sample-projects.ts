import { db } from "../db";
import { projects } from "../db/schema";

const sampleProjects = [
  {
    title: "E-commerce Platform",
    description: "A modern e-commerce platform built with React and Node.js",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    technologies: ["React", "Node.js", "PostgreSQL"],
    link: "https://github.com/example/ecommerce",
    position: JSON.stringify([0, 0, -3]),
    rotation: JSON.stringify([0, 0, 0]),
  },
  {
    title: "AI Chat Application",
    description: "Real-time chat application with AI-powered responses",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80",
    technologies: ["TypeScript", "OpenAI", "WebSocket"],
    link: "https://github.com/example/ai-chat",
    position: JSON.stringify([3, 0, 0]),
    rotation: JSON.stringify([0, -Math.PI / 2, 0]),
  },
  {
    title: "3D Game Engine",
    description: "Custom 3D game engine built with WebGL",
    image: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800&q=80",
    technologies: ["WebGL", "Three.js", "TypeScript"],
    link: "https://github.com/example/3d-engine",
    position: JSON.stringify([-3, 0, 0]),
    rotation: JSON.stringify([0, Math.PI / 2, 0]),
  },
  {
    title: "Social Media Dashboard",
    description: "Analytics dashboard for social media management",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    technologies: ["Vue.js", "D3.js", "Firebase"],
    link: "https://github.com/example/social-dashboard",
    position: JSON.stringify([0, 0, 3]),
    rotation: JSON.stringify([0, Math.PI, 0]),
  },
];

async function insertSampleProjects() {
  try {
    await db.insert(projects).values(sampleProjects);
    console.log("Sample projects inserted successfully!");
  } catch (error) {
    console.error("Failed to insert sample projects:", error);
  }
  process.exit(0);
}

insertSampleProjects();
