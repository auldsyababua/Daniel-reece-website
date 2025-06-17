FROM n8nio/n8n:latest

# Install additional dependencies if needed
USER root

# Create data directory with proper permissions
RUN mkdir -p /data && chown -R node:node /data

USER node

# Set the working directory
WORKDIR /data

# Expose n8n port
EXPOSE 5678

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5678/healthz || exit 1

# Start n8n
CMD ["n8n", "start"]