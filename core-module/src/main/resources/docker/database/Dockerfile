FROM library/postgres
COPY init.sql /docker-entrypoint-initdb.d/
COPY init.sql /init.sql/
ENV POSTGRES_USER prostrmk
ENV POSTGRES_PASSWORD 0
ENV POSTGRES_DB truck
