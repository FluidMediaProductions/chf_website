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
RUN pip install -e git+https://github.com/lazybird/django-solo.git@4ba01cd66f1c4b1886cec0bdf81887954254ef15#egg=django-solo && pip install -r requirements.txt
COPY ./src /src
CMD /src/start.sh
EXPOSE 8000
