# Docker website demo images for REDAXO

A collection of website demos made with ❤️ and REDAXO.

![Screenshot](https://raw.githubusercontent.com/FriendsOfREDAXO/docker-demos/assets/docker-demos_01.jpg)

## Supported tags

* __`base`__  
  This demo aims to primarily help beginners, and it demonstrates just _one_ way how to develop a website with REDAXO.  
  [https://github.com/FriendsOfREDAXO/demo_base/](https://github.com/FriendsOfREDAXO/demo_base/)
* __`onepage`__  
  This demo demonstrates 3 ways how to build a onepage website: with modules, with articles, with categories. _(German)_   
  [https://github.com/FriendsOfREDAXO/demo_onepage/](https://github.com/FriendsOfREDAXO/demo_onepage/)
* __`community`__  
  In this demo you can see how to use the community addOn to create a website where users can register and login to protected areas. _(German)_  
  [https://github.com/FriendsOfREDAXO/demo_community/](https://github.com/FriendsOfREDAXO/demo_community/)


## Environment variables

👉 Environment variables correspond 1:1 to those of the __REDAXO image__. Find a complete list here:  
[https://github.com/FriendsOfREDAXO/docker-redaxo/#environment-variables](https://github.com/FriendsOfREDAXO/docker-redaxo/#environment-variables)


## Usage

👉 Note that the demos are used 1:1 like the __REDAXO image__, except that you chose a different source: For the code examples we use `friendsofredaxo/demo:base`, which is the base demo. But if you would like to use the `onepage` demo instead, just change `friendsofredaxo/demo:base` to `friendsofredaxo/demo:onepage`.

### With [`docker-compose`](https://docs.docker.com/compose/reference/overview/)

Create a `docker-compose.yml` in your project directory with the following code:

```yml
version: '3'
services:

  redaxo:
    image: friendsofredaxo/demo:base
    ports:
      - 20080:80
    volumes:
      - redaxo:/var/www/html
    environment:
      REDAXO_SERVER: http://localhost:20080
      REDAXO_SERVERNAME: 'My Website'
      REDAXO_ERROR_EMAIL: john@doe.example
      REDAXO_LANG: en_gb
      REDAXO_TIMEZONE: Europe/London
      REDAXO_DB_HOST: db
      REDAXO_DB_NAME: redaxo
      REDAXO_DB_LOGIN: redaxo
      REDAXO_DB_PASSWORD: 's3cretpasswOrd!'
      REDAXO_DB_CHARSET: utf8mb4
      REDAXO_ADMIN_USER: admin
      REDAXO_ADMIN_PASSWORD: 'PunKisNOT!dead'

  db:
    image: mysql:8
    volumes:
      - db:/var/lib/mysql
    environment:
      MYSQL_DATABASE: redaxo
      MYSQL_USER: redaxo
      MYSQL_PASSWORD: 's3cretpasswOrd!'
      MYSQL_RANDOM_ROOT_PASSWORD: 'yes'

volumes:
  redaxo:
  db:
```
After you have created a `docker-compose.yml` file in your project directory, run `docker-compose up -d` in your terminal too download, and start the container.
With `docker-compose stop` you can stop the container.

## Recipes

🧁 See [recipes](https://github.com/FriendsOfREDAXO/docker-redaxo/tree/master/recipes) section within the REDAXO image repo for further examples!


## Need help?

If you have questions or need help, feel free to contact us in __Slack Chat__! You will receive an invitation here: [https://redaxo.org/slack/](https://redaxo.org/slack/)
