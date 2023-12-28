#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q %%PACKAGE_NAME%% %%PACKAGE_VERSION%%
php redaxo/bin/console package:install -q %%PACKAGE_NAME%%
php redaxo/bin/console cache:clear -q
php redaxo/bin/console %%PACKAGE_NAME%%:install -q -y

chown -R www-data:www-data ./
