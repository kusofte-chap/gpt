import React, { useEffect } from 'react'
import mdEngine from '@/until/mdit'
import GptAvatar from '@/assets/logo.svg'
import 'highlight.js/styles/atom-one-dark.css';

const ctn = `
在 ChatGPT 使用 EventSource 推送消息的过程中，接收到的消息需要被解析成 Markdown 格式并转化为 HTML。具体实现可以通过以下步骤来完成：

1. **接收数据**：使用 EventSource 接收服务器推送的消息。
2. **解析 Markdown**：将接收到的 Markdown 数据解析为 HTML。
3. **更新显示**：将解析后的 HTML 更新到页面上。

在 React 中，具体实现方式可以参考以下步骤和示例代码：

### 1. 安装 Markdown 解析库
首先，需要安装一个 Markdown 解析库，比如 \`marked\` 或 \`markdown-it\`。在这个例子中，我们使用 \`marked\`。

\`\`\`sh
npm install marked
\`\`\`

### 2. 创建 React 组件
接下来，创建一个 React 组件来处理 EventSource 的连接、消息接收、Markdown 解析和内容显示。

\`\`\`javascript
import React, { useState, useEffect } from 'react';
import marked from 'marked';

const TypingEffect = () => {
  const [messages, setMessages] = useState([]);  // 存储接收到的消息
  const [currentMessage, setCurrentMessage] = useState('');  // 当前正在打字的消息
  const [displayedText, setDisplayedText] = useState('');  // 显示的文本
  const [typingIndex, setTypingIndex] = useState(0);  // 当前打字位置

  useEffect(() => {
    const eventSource = new EventSource('/your-sse-endpoint');

    eventSource.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    eventSource.onerror = () => {
      console.error('EventSource failed.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0 && typingIndex === displayedText.length) {
      const nextMessage = messages.shift();
      setCurrentMessage(nextMessage);
      setDisplayedText('');
      setTypingIndex(0);
    }
  }, [messages, typingIndex, displayedText.length]);

  useEffect(() => {
    if (currentMessage.length > 0 && typingIndex < currentMessage.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + currentMessage[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 50);  // 控制打字速度
      return () => clearTimeout(timeoutId);
    } else if (typingIndex === currentMessage.length) {
      setTimeout(() => {
        setDisplayedText((prev) => prev + '\\n');  // 每段落结束后换行
      }, 50);
    }
  }, [currentMessage, typingIndex]);

  useEffect(() => {
    // 当显示的文本更新时，解析 Markdown 并设置 HTML 内容
    const htmlContent = marked(displayedText);
    document.getElementById('output').innerHTML = htmlContent;
  }, [displayedText]);

  return <div id="output" />;
};

export default TypingEffect;
\`\`\`


### 解释

1. **接收数据**：
   - 使用 \`EventSource\` 对象连接到服务器的 SSE 端点。
   - 监听 \`onmessage\` 事件接收服务器推送的消息，并将其存储到 \`messages\` 状态中。

2. **逐字符显示**：
   - 使用 \`useEffect\` 钩子监控 \`currentMessage\` 和 \`typingIndex\` 的变化，逐字符显示消息内容。
   - 当一条消息全部显示完毕后，取下一条消息继续显示。

3. **解析 Markdown**：
   - 使用 \`useEffect\` 钩子监控 \`displayedText\` 的变化。
   - 每次 \`displayedText\` 更新时，使用 \`marked\` 库将其解析为 HTML。
   - 将解析后的 HTML 设置到一个指定的 \`div\` 元素中。

这个实现方式确保了逐字符显示消息，并且实时解析 Markdown 格式，转化为 HTML 并显示在页面上。这样就能在接收到服务器推送的消息时，逐步显示并解析成对应的 Markdown 格式内容。
`;





export default function TypingMarkdown() {

  useEffect(() => {
    const el = document.getElementById('markdown')
    if (el) {
      el.innerHTML = mdEngine.render(ctn);
    }
  }, [])


  return (
    <div className='w-full text-token-text-primary'>
      <div className='py-2 px-3 text-base m-auto md:px-5 lg:px-1 xl:px-5'>
        <div className='mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
          <div className='flex-shrink-0 flex flex-col relative items-end'>
            <div>
              <div className='pt-0.5'>
                <div className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border'>
                  <div className='relative flex items-center justify-center'>
                    <GptAvatar />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='relative flex w-full min-w-0 flex-col'>
            <div className='font-semibold select-none'>ChatGPT</div>
            <div className='flex-col gap-1 md:gap-3'>
              <div className='flex flex-grow flex-col max-w-full'>
                <div className='min-h-[20px] flex flex-col items-start break-words overflow-x-auto gap-3' >
                  <div className='markdown prose w-full break-words' id='markdown'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
