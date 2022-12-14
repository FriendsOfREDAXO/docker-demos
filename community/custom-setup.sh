#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q demo_community 4.0.0
php redaxo/bin/console package:install -q demo_community
php redaxo/bin/console cache:clear -q
php redaxo/bin/console demo_community:install -q -y

chown -R www-data:www-data ./
