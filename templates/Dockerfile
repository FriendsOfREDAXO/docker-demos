FROM friendsofredaxo/redaxo:5.11.0-php7.4-apache

# copy custom setup script
# will be executed within the REDAXO container once the REDAXO setup was finished
COPY custom-setup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/custom-setup.sh
