FROM friendsofredaxo/redaxo:5

# needed for workaround until R5.10.1 is released.
COPY mysql.list /etc/apt/sources.list.d/mysql.list.old
RUN set -e; \
    savedAptMark="$(apt-mark showmanual)"; \
    apt-get update; \
    apt-get install -y gnupg; \
    apt-key adv --keyserver keys.gnupg.net --recv-keys 8C718D3B5072E1F5; \
    mv /etc/apt/sources.list.d/mysql.list.old /etc/apt/sources.list.d/mysql.list; \
    apt-get update; \
    apt-get install -y mysql-client; \
    apt-mark auto '.*' > /dev/null; \
    apt-mark manual $savedAptMark; \
    rm -rf /var/lib/apt/lists/*

# copy custom setup script
# will be executed within the REDAXO container once the REDAXO setup was finished
COPY custom-setup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/custom-setup.sh
