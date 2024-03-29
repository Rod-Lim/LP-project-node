## Afin de démarer le projet correctement : 

Après avoir cloné le repository, suivez les étapes suivantes :

1. Réalisez la commande ```npm install``` depuis un terminal en vous placant à la racine du projet.

2. Lancez le conteneur docker avec la commande suivante : ```docker run -p 3306:3306 --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d mysql:5```. Ce conteneur sera la base de données du projet avec comme nom d'utilisateur root et mot de passe hapi.

3. Allez dans ``/server/.env`` et le compléter pour tout configurer. Pour modifier la connexion à la BD (si vous ne voulez pas passer par le conteneur docker et que vous avez une BD de votre côté), vous pouvez rajouter cela dans le .env :
``` 
# For DB connection :
DB_HOST = your_host
DB_USER = your_user
DB_PASSWORD = your_password
DB_DATABASE = your_database_name
```
PS : Pour configurer les mails, vous pouvez vous rendre à l'adresse suivante : https://ethereal.email/ et créer un nouveau compte, cela vous donnera une configuration fonctionnelle rapidement.

4. Démarrez le serveur en vous placant à la racine du projet et en lançant la commande ```npm start```

Si tout s'est bien passé, vous pouvez normalement vous rendre à l'adresse http://localhost:3000/documentation et accéder aux différentes méthodes de l'API.
