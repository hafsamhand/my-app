FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* tsconfig.json ./
COPY src ./src
RUN npm ci --production
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/main.js"]
