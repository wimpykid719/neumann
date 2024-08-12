FROM node:22-slim
WORKDIR /usr/src

COPY . /proxy/
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "run", "dev"]
