#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q demo_fullpage 2.0.10
php redaxo/bin/console package:install -q demo_fullpage
php redaxo/bin/console cache:clear -q
php redaxo/bin/console demo_fullpage:install -q -y

chown -R www-data:www-data ./
