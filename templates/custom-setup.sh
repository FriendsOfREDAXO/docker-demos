#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q %%PACKAGE%% %%VERSION%%
php redaxo/bin/console package:install -q %%PACKAGE%%
php redaxo/bin/console cache:clear -q
php redaxo/bin/console %%PACKAGE%%:install -q -y

# workaround until R5.10.1 is released.
mysql -h$REDAXO_DB_HOST \
      -u$REDAXO_DB_LOGIN \
      -p$REDAXO_DB_PASSWORD \
      -D$REDAXO_DB_NAME \
      -e "UPDATE rex_user SET login_tries = 0;" \
      2> /dev/null

chown -R www-data:www-data ./
