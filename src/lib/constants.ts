import path from "path";

/**
 * Centralized constants for the application
 */

// File paths
export const PATHS = {
  ARTICLES_FOLDER: path.join(process.cwd(), "public/articles"),
  ARTICLES_WORK_FOLDER: path.join(process.cwd(), "public/articles/work"),
  ARTICLES_BLOG_FOLDER: path.join(process.cwd(), "public/articles/blog"),
  DEMOS_FOLDER: path.join(process.cwd(), "src/app/demos"),
} as const;

// Content limits
export const CONTENT = {
  ARTICLE_EXCERPT_LENGTH: 300, // Characters to show in article previews
  DEFAULT_IMAGE_WIDTH: 800,
  DEFAULT_IMAGE_HEIGHT: 600,
} as const;

// Layout constants
export const LAYOUT = {
  STICKY_CARD_TOP_OFFSET: -81, // Pixels for sticky card positioning
} as const;
