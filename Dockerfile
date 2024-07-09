FROM node:19.1.0
# 设置工作目录
WORKDIR /app
# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./
# 安装依赖
RUN npm install
# 复制项目文件
COPY . .
# 生成 Next.js 项目（生产环境）
RUN npm run build
# 暴露应用程序运行的端口
EXPOSE 3000
# 启动 Next.js 应用程序
CMD ["npm", "start"]

