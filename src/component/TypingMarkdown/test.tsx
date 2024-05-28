// import MarkdownIt from 'markdown-it';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark.css';

// const md = new MarkdownIt({
//   html: true, // 允许 HTML 标签
//   xhtmlOut: false,
//   breaks: false,
//   langPrefix: 'language-',
//   linkify: true,
//   typographer: true,
//   quotes: '“”‘’',
//   highlight: function (str, lang) {
//     if (lang && hljs.getLanguage(lang)) {
//       try {
//         return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
//       } catch (__) {}
//     }
//     return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
//   }
// });

// // 自定义渲染器，添加复制按钮和语言显示
// md.renderer.rules.fence = function(tokens, idx, options, env, self) {
//   const token = tokens[idx];
//   const langName = token.info.trim() || 'plaintext';
//   const code = token.content.trim();
//   const highlightedCode = options.highlight ? options.highlight(code, langName) : md.utils.escapeHtml(code);
  
//   return `
//     <div class="code-block">
//       <div class="code-header">
//         <span class="code-lang">${langName}</span>
//         <button class="copy-button" onclick="copyCode(this)">Copy</button>
//       </div>
//       ${highlightedCode}
//     </div>
//     <script>
//       function copyCode(button) {
//         const codeBlock = button.parentNode.nextSibling;
//         const code = codeBlock.innerText;
//         navigator.clipboard.writeText(code).then(() => {
//           button.innerText = 'Copied!';
//           setTimeout(() => {
//             button.innerText = 'Copy';
//           }, 2000);
//         }).catch(err => {
//           console.error('Failed to copy text: ', err);
//         });
//       }
//     </script>
//   `;
// };

// // 示例 Markdown 内容
// const markdownContent = `
// \`\`\`javascript
// console.log('Hello, world!');
// \`\`\`

// \`\`\`python
// print('Hello, world!')
// \`\`\`
// `;

// // 解析和渲染 Markdown 内容
// const htmlContent = md.render(markdownContent);

// // 输出结果
// console.log(htmlContent);
