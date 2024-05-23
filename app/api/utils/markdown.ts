import { marked } from "marked";

export const aiMentionRegex = /(@ai|@assistant)/gi;

function postprocess(html: string) {
  const output = html.replace(aiMentionRegex, (match) => {
    return `<span class="px-1 py-1 rounded bg-white/75 text-red-700 font-semibold">${match}</span>`;
  });

  return output;
}
marked.use({ hooks: { postprocess } });

export const markdownToHtml = marked;
