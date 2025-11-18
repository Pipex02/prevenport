# ---------- Build stage ----------
FROM node:20-alpine AS build

# Work in /app (root of repo)
WORKDIR /app

# Copy the whole repo
COPY . .

# NOW move into your landing page app (relative to /app)
WORKDIR /app/apps/home

# Install deps for this app only
RUN npm install

# Build Vite app
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# Copy built files to Nginx html dir
COPY --from=build /app/apps/home/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
