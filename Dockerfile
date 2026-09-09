# =========================================================
# Stage 1: Build React/Vite application
# =========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy application source
COPY . .

# Build production frontend
RUN npm run build


# =========================================================
# Stage 2: Serve with Nginx
# =========================================================
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy React production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
