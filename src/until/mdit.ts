import md from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it/index.js'

const mdParser:MarkdownIt = md({
  html: false,
  xhtmlOut: false,
  breaks: true,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (str:string, lang:string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<code class="!whitespace-pre hljs language-${lang}">${hljs.highlight(lang, str, true).value}</code>`;
      } catch (__) {}
    }
    return `<code class="!whitespace-pre hljs language-${lang}">${mdParser.utils.escapeHtml(str)}</code>`;
  }
})

mdParser.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdParser.use(mdKatex, { blockClass: 'katex-block', errorColor: ' #cc0000', output: 'mathml' })

mdParser.renderer.rules.strong_open = function() {
  return '<strong>';
};

mdParser.renderer.rules.strong_close = function() {
  return '</strong>';
};

mdParser.renderer.rules.fence = function(tokens:any, idx:number, options:any, env:any, self:any) {
  const token = tokens[idx];
  const langName = token.info.trim() || 'plaintext';
  const code = token.content.trim();
  const highlightedCode = options.highlight ? options.highlight(code, langName) : self.utils.escapeHtml(code);
  
  return `
      <div class="dark bg-[#0d0d0d] rounded-md border-[0.5px] border-token-border-medium">
        <div class="flex items-center relative text-token-text-secondary bg-[#2f2f2f] px-4 py-2 text-xs font-sans justify-between rounded-t-md">
          <span>${langName}</span>
          <div class="flex items-center">
            <button class="flex gap-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>
            复制代码
            </button>
          </div>
        </div>
        <div class="overflow-y-auto p-4 text-left" dir="ltr">
          ${highlightedCode}
        </div>
      </div>
  `;
};



export default mdParser

