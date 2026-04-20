// sanity.config.js
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes/index";

export default defineConfig({
  name: "default",
  title: "Pathfinder College",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  basePath: "/studio", // ← this is the missing piece
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
