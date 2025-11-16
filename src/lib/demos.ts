import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { demosConfig } from "./demos-config";
import { logger } from "./logger";
import { PATHS } from "./constants";

export type Demo = {
  path: string;
  title: string;
  subtitle: string;
  year: string;
  thumbnail: string;
  // Smaller order shown first. Null order is last. Sorted alphabetically within
  // order.
  order: number | null;
  // If true, will show up in navigation.
  visible: boolean;
};

const demosFolder = PATHS.DEMOS_FOLDER;

const findDemoDirectories = async (dirPath: string): Promise<string[]> => {
  const directories: string[] = [];

  try {
    const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dirPath, entry.name);
        const pageFile = path.join(fullPath, "page.tsx");

        // Check if this directory has a page.tsx file
        if (fs.existsSync(pageFile)) {
          directories.push(entry.name);
        }

        // Recursively check subdirectories
        const subdirs = await findDemoDirectories(fullPath);
        directories.push(
          ...subdirs.map((subdir) => path.join(entry.name, subdir))
        );
      }
    }
  } catch (error) {
    logger.error("Error reading demos directory:", error);
  }

  return directories;
};

export const getAllDemos = async (): Promise<Demo[]> => {
  const demoDirectories = await findDemoDirectories(demosFolder);

  const demos: Demo[] = [];

  for (const dir of demoDirectories) {
    const config = demosConfig[dir as keyof typeof demosConfig];

    if (config && config.visible) {
      const demo: Demo = {
        path: `/demos/${dir}`,
        title: config.title || dir,
        subtitle: config.subtitle || "",
        year: config.year || "",
        thumbnail: config.thumbnail || "",
        order: config.order,
        visible: config.visible,
      };

      demos.push(demo);
    }
  }

  // Sort by order
  return demos.sort((a, b) => {
    const aOrder = a.order || Infinity;
    const bOrder = b.order || Infinity;

    // If same order, sort alphabetically by title
    return aOrder === bOrder ? a.title.localeCompare(b.title) : aOrder - bOrder;
  });
};
