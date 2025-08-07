FROM n8nio/n8n:latest

USER root

# Install Chromium + dependencies
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ttf-freefont \
  nodejs \
  npm \
  udev \
  dumb-init \
  bash \
  curl \
  wget \
  libc6-compat \
  alsa-lib \
  at-spi2-core \
  dbus-glib \
  gtk+3.0 \
  xvfb

# Puppeteer expects Chromium path here
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install Puppeteer + plugins
RUN npm install -g \
  puppeteer \
  puppeteer-extra \
  puppeteer-extra-plugin-stealth \
  puppeteer-extra-plugin-user-preferences \
  puppeteer-extra-plugin-user-data-dir

# Copy local files into image
COPY workflows /workflows
COPY credentials /credentials
COPY startup.sh /startup.sh

RUN chmod +x /startup.sh

USER node

# Start script
ENTRYPOINT ["/startup.sh"]
