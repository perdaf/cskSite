import { marked } from "./marked.esm.js";

// js-yaml is loaded globally via script tag
const jsYaml = window.jsyaml || window.YAML || window.yaml;

/**
 * Parse markdown content with YAML frontmatter using js-yaml
 * @param {string} content - Full markdown content with frontmatter
 * @returns {Object} Parsed content with frontmatter and HTML
 */
export function parseMarkdownContent(content) {
  // Split frontmatter and content
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    console.error("No frontmatter found in content");
    return {
      frontmatter: {},
      html: marked.parse(content),
      hero: null,
      featuredProducts: [],
      testimonials: [],
      about: null,
      contact: null,
    };
  }

  const frontmatterText = frontmatterMatch[1];
  const markdownContent = frontmatterMatch[2];

  let data = {};
  try {
    // Use js-yaml to parse the frontmatter if available
    if (jsYaml && jsYaml.load) {
      data = jsYaml.load(frontmatterText) || {};
      //console.log("YAML parsed successfully with js-yaml:", data);
    } else {
      console.warn("js-yaml not available, using fallback parser");
      data = parseYAMLFallback(frontmatterText);
    }
  } catch (error) {
    console.error("Error parsing YAML frontmatter:", error);
    console.warn("Falling back to custom parser");
    data = parseYAMLFallback(frontmatterText);
  }

  // Parse markdown content
  const html = marked.parse(markdownContent);

  return {
    frontmatter: data,
    html,
    hero: data.hero || null,
    featuredProducts: data.featuredProducts || [],
    testimonials: data.testimonials || [],
    about: data.about || null,
    contact: data.contact || null,
    categories: data.categories || [],
    colors: data.colors || {},
    typography: data.typography || {},
    products: data.products || [],
  };
}

/**
 * Fallback YAML parser for basic structures
 */
function parseYAMLFallback(yamlText) {
  const data = {};
  const lines = yamlText.split("\n");
  let currentKey = null;
  let currentArray = null;
  let currentObject = null;
  let indentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.length - line.trimLeft().length;

    if (!trimmed || trimmed.startsWith("#")) continue;

    // Handle key-value pairs
    if (trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      // Reset context based on indentation
      if (indent === 0) {
        currentArray = null;
        currentObject = null;
      }

      // Handle arrays
      if (
        value === "" &&
        i + 1 < lines.length &&
        lines[i + 1].trim().startsWith("-")
      ) {
        currentArray = [];
        data[key] = currentArray;
        currentKey = key;
        continue;
      }

      // Handle objects
      if (value === "" && !currentArray) {
        currentObject = {};
        data[key] = currentObject;
        currentKey = key;
        continue;
      }

      // Handle simple key-value pairs
      if (value && value !== "") {
        const cleanValue = value.replace(/^["']|["']$/g, "");

        if (currentObject && indent > 0) {
          currentObject[key] = cleanValue;
        } else if (currentArray && currentArray.length > 0) {
          const lastItem = currentArray[currentArray.length - 1];
          if (typeof lastItem === "object") {
            lastItem[key] = cleanValue;
          }
        } else {
          data[key] = cleanValue;
        }
      }
    }

    // Handle array items
    if (trimmed.startsWith("-")) {
      const itemContent = trimmed.substring(1).trim();

      if (itemContent.includes(":")) {
        // Object in array
        const colonIndex = itemContent.indexOf(":");
        const key = itemContent.substring(0, colonIndex).trim();
        const value = itemContent
          .substring(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");

        if (currentArray) {
          if (
            currentArray.length > 0 &&
            typeof currentArray[currentArray.length - 1] === "object"
          ) {
            currentArray[currentArray.length - 1][key] = value;
          } else {
            const newObj = {};
            newObj[key] = value;
            currentArray.push(newObj);
          }
        }
      } else {
        // Simple string in array
        const cleanValue = itemContent.replace(/^["']|["']$/g, "");
        if (currentArray) {
          currentArray.push(cleanValue);
        }
      }
    }

    // Handle nested properties in array objects
    if (
      currentArray &&
      currentArray.length > 0 &&
      typeof currentArray[currentArray.length - 1] === "object" &&
      trimmed.includes(":") &&
      !trimmed.startsWith("-") &&
      indent > 2
    ) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed
        .substring(colonIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "");

      if (value) {
        currentArray[currentArray.length - 1][key] = value;
      }
    }
  }

  return data;
}

// Export the main function as default
export default parseMarkdownContent;
