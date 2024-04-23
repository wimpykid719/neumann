FROM ruby:3.2.2
WORKDIR /backend

RUN set -eux && \
    apt-get update -qq && \
    apt-get install -y \
      default-mysql-client


COPY Gemfile Gemfile.lock* /backend/
COPY . /backend/

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# イメージ実行時に起動させる主プロセスを設定
CMD ["rails", "server", "-p", "8080", "-b", "0.0.0.0"]