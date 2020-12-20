#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q demo_onepage 1.4.0
php redaxo/bin/console package:install -q demo_onepage
php redaxo/bin/console cache:clear -q
php redaxo/bin/console demo_onepage:install -q -y

chown -R www-data:www-data ./
