FROM friendsofredaxo/redaxo:php7.4-apache

# create mount point for web root
#VOLUME /var/www/html

# declare REDAXO version and checksum
#ENV REDAXO_VERSION=5.10.0 REDAXO_SHA=3027c9745d4bb62db51733995b901cdd6e4406a6

# fetch REDAXO, validate checksum and extract to tmp folder
#RUN set -e; \
#    curl -Ls -o redaxo.zip https://github.com/redaxo/redaxo/releases/download/${REDAXO_VERSION}/redaxo_${REDAXO_VERSION}.zip; \
#    echo "${REDAXO_SHA} *redaxo.zip" | shasum -c -a 256; \
#    unzip -oq redaxo.zip -d /usr/src/redaxo; \
#    rm redaxo.zip; \
#    chown -R www-data:www-data /usr/src/redaxo

#   # fetch REDAXO, validate checksum and extract to tmp folder
RUN set -e; \
   rm -rf /usr/src/redaxo; \
   curl -Ls -o redaxo.zip https://github.com/redaxo/redaxo/archive/master.zip; \
   unzip -oq redaxo.zip -d /usr/src; \
   mv /usr/src/redaxo-master /usr/src/redaxo; \
   rm redaxo.zip; \
   chown -R www-data:www-data /usr/src/redaxo

# copy and run entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

# run CMD
CMD ["apache2-foreground"]
