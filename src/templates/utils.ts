export default {
  cn:
    "import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\n/**\n * Utility function to merge CSS class names with Tailwind CSS support\n * @param inputs - CSS class names to merge\n * @returns Merged class names string\n */\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}",
};
