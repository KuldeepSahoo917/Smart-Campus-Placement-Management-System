# ------------------------------------------
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Compose se value yahan aayegi
ARG VITE_BACKEND_URL

# Vite ko batane ke liye ise ENV mein set karna padta hai
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL


# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app source
COPY . .

# Build the app for production
RUN npm run build

# ------------------------------------------
# Stage 2: Serve with nginx
# ------------------------------------------
FROM nginx:1.25-alpine

# remove the nginx.conf file
RUN rm /etc/nginx/conf.d/default.conf

# copy the nginx file which is i am create and paste this
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from stage-1
COPY --from=builder /app/dist  /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# run the application
CMD  ["nginx","-g", "daemon off;"]
