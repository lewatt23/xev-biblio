# Stage 1: Build the Angular application
FROM node:16-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files into the docker image
COPY . .

# Build the Angular app in production mode and store the artifacts in dist folder
RUN npm run build -- --output-path=./dist/out --configuration production

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts from the builder stage
COPY --from=builder /app/dist/out/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
