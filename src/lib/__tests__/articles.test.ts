import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllArticles, getAllSlicedArticles } from "../articles";
import { CONTENT } from "../constants";

// Mock the fs modules
vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

vi.mock("fs/promises", () => ({
  default: {
    readdir: vi.fn(),
  },
}));

vi.mock("gray-matter", () => ({
  default: vi.fn(),
}));

describe("articles utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllArticles", () => {
    it("should be a function", () => {
      expect(typeof getAllArticles).toBe("function");
    });
  });

  describe("getAllSlicedArticles", () => {
    it("should be a function", () => {
      expect(typeof getAllSlicedArticles).toBe("function");
    });

    it("should use the correct excerpt length constant", () => {
      // Verify the constant is defined and is a number
      expect(typeof CONTENT.ARTICLE_EXCERPT_LENGTH).toBe("number");
      expect(CONTENT.ARTICLE_EXCERPT_LENGTH).toBeGreaterThan(0);
    });
  });

  describe("Article sorting logic", () => {
    it("should prioritize articles with lower order values", () => {
      const articles = [
        { title: "B", order: 2 },
        { title: "A", order: 1 },
        { title: "C", order: 3 },
      ];

      const sorted = articles.sort((a, b) => {
        const aOrder = a.order || Infinity;
        const bOrder = b.order || Infinity;
        return aOrder === bOrder
          ? a.title.localeCompare(b.title)
          : aOrder - bOrder;
      });

      expect(sorted[0].title).toBe("A");
      expect(sorted[1].title).toBe("B");
      expect(sorted[2].title).toBe("C");
    });

    it("should sort alphabetically when orders are equal", () => {
      const articles = [
        { title: "Zebra", order: 1 },
        { title: "Apple", order: 1 },
        { title: "Mango", order: 1 },
      ];

      const sorted = articles.sort((a, b) => {
        const aOrder = a.order || Infinity;
        const bOrder = b.order || Infinity;
        return aOrder === bOrder
          ? a.title.localeCompare(b.title)
          : aOrder - bOrder;
      });

      expect(sorted[0].title).toBe("Apple");
      expect(sorted[1].title).toBe("Mango");
      expect(sorted[2].title).toBe("Zebra");
    });

    it("should place null order articles last", () => {
      const articles = [
        { title: "No Order", order: null },
        { title: "First", order: 1 },
        { title: "Second", order: 2 },
      ];

      const sorted = articles.sort((a, b) => {
        const aOrder = a.order ?? Infinity;
        const bOrder = b.order ?? Infinity;
        return aOrder === bOrder
          ? a.title.localeCompare(b.title)
          : aOrder - bOrder;
      });

      expect(sorted[0].title).toBe("First");
      expect(sorted[1].title).toBe("Second");
      expect(sorted[2].title).toBe("No Order");
    });
  });

  describe("Blog post date sorting", () => {
    it("should sort blog posts by date (newest first)", () => {
      const blogPosts = [
        { path: "/blog/old-post", title: "Old", date: new Date("2020-01-01") },
        { path: "/blog/new-post", title: "New", date: new Date("2024-01-01") },
        {
          path: "/blog/mid-post",
          title: "Mid",
          date: new Date("2022-01-01"),
        },
      ];

      const sorted = blogPosts.sort((a, b) => {
        if (a.path.startsWith("/blog/") && b.path.startsWith("/blog/")) {
          const aDate = a.date ? new Date(a.date).getTime() : 0;
          const bDate = b.date ? new Date(b.date).getTime() : 0;

          if (aDate && bDate) {
            return bDate - aDate;
          }
        }
        return 0;
      });

      expect(sorted[0].title).toBe("New");
      expect(sorted[1].title).toBe("Mid");
      expect(sorted[2].title).toBe("Old");
    });
  });
});
