#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q %%PACKAGE%% %%VERSION%%
php redaxo/bin/console package:install -q %%PACKAGE%%
php redaxo/bin/console cache:clear -q
php redaxo/bin/console %%PACKAGE%%:install -q -y

chown -R www-data:www-data ./
