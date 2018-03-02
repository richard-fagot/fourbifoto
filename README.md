# Configure Angular for electron
http://www.matthiassommer.it/software-architecture/webpack-node-modules/

# Notify model changes
Need to study the three solutions to determining which one to use in each situation.
For instance, use NgZone.run();
https://stackoverflow.com/questions/35105374/how-to-force-a-components-re-rendering-in-angular-2

# Material Design Lite Extension
https://github.com/leifoolsen/mdl-ext


"exif-reader": "github:inukshuk/exif-reader#patched",

# Tips
Il faut lancer l'appli angular en mode prod pour avoir les droits d'accès suffisants au disque (en mode ng serve, on passe par le navigateur normal qui n'a pas le droit d'accéder au disque).

# User Stories
## Importer un dossier photo
1. Fichier > Ajouter un dossier ;
2. Afficher le répertoire sous *Dossier* ;
3. Afficher les photos du dossier et de ses sous-dossier par date tirée des exifs (les photos sans exif ou sans date sont affichée à la date 00/00/0000).