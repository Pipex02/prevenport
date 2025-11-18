# ---------- Build stage ----------
FROM node:20-alpine AS build

# Work in /app
WORKDIR /app

# Copy the whole repo (simplest & safest for now)
COPY . .

# Move into your landing page app
WORKDIR /apps/home

# Install deps for this app only
RUN npm install

# Build Vite app (uses your existing "build" script)
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# Copy built files to Nginx html dir
COPY --from=build /apps/home/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
