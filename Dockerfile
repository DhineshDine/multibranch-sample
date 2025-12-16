FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY src ./src
RUN npm run build

#---RUN TIME STAGE ----
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production 
EXPOSE 3000
CMD ["node","dist/index.js"]
