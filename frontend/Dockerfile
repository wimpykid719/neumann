FROM node:16.15.0
WORKDIR /frontend

# ワイルドカードで不確定の場合がある際は必ず一つは存在するファイルをCOPYする必要がある。
COPY Dockerfile /neumann-client/package.json* /neumann-client/package-lock.json* /frontend

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# イメージ実行時に起動させる主プロセスを設定
CMD ["npm", "run", "dev"]