FROM node:21
WORKDIR /frontend
ARG NEXT_PUBLIC_API_URL

COPY /neumann-client /frontend/

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# イメージ実行時に起動させる主プロセスを設定
CMD ["npm", "run", "dev"]