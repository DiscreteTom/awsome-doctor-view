import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-java";
import "prismjs/components/prism-matlab";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

const renderer = new marked.Renderer();

marked.setOptions({
  renderer,
  highlight: function (code, lang) {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

export default (context, inject) => {
  inject("md", marked);
};
