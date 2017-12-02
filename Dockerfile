FROM python:3.5
ENV PYTHONUNBUFFERED 1
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        nginx \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /src
WORKDIR /src
ADD requirements.txt /src
RUN pip install -r requirements.txt
COPY ./src /src

CMD /src/start.sh
EXPOSE 8000
