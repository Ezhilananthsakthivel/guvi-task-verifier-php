FROM node:slim
ENV process.env.GIT_TOKEN=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 \
    process.env.PORT=3001
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3001
CMD node index.js