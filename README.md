## Afin de démarer le projet correctement : 

Après avoir cloné le repository, suivez les étapes suivantes :

1. Réalisez la commande ```npm install``` depuis un terminal dans le répertoire du projet.

2. Lancez le conteneur docker avec la commande suivante : ```docker run -p 3306:3306 --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d mysql:5```. Ce conteneur sera la base de données du projet avec comme nom d'utilisateur root et mot de passe hapi.

3. Configuration mailer : Allez dans ``/lib/services/mail.js`` et remplacer les constantes de la fonction ``sendMail()``.

Configuration des variables d'environnements : Créez à la racine du projet un fichier ```.env```. Ajoutez-y les variables d'environnement suivantes. Si vous utilisez la commande docker de l'étape précédente, vous n'avez pas besoin de configurer les variables d'environnements de la base de données.
    Pour configurer les mails, vous pouvez vous rendre à l'adresse suivante : https://ethereal.email/ et créer un nouveau compte. Cela vous donnera une configuration fonctionnelle.

4. Démarrez le serveur en vous placant à la racine du projet et en lançant la commande ```npm start```

Si tout s'est bien passé, vous pouvez normalement vous rendre à l'adresse http://localhost:3000/documentation et accéder aux différentes méthodes de l'API.
