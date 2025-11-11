FROM node:18-alpine

WORKDIR /app

# Copy only package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Ensure node_modules is ignored when mounting volumes (avoid overwriting)
VOLUME ["/app/node_modules"]

EXPOSE 3000

# Run the dev server
CMD ["npm", "start"]
