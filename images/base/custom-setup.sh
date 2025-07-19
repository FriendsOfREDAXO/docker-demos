#!/bin/bash
set -euo pipefail

cd /var/www/html

php redaxo/bin/console install:download -q demo_base 3.3.3
php redaxo/bin/console package:install -q demo_base
php redaxo/bin/console cache:clear -q
php redaxo/bin/console demo_base:install -q -y

chown -R www-data:www-data ./
