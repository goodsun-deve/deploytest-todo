# Simple static deployment using Nginx
FROM nginx:alpine

# Copy static site into Nginx web root
COPY . /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

# Use the default Nginx startup command
CMD ["nginx", "-g", "daemon off;"]

