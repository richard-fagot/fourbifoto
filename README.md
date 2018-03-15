# NEXT STEP

Ajouter la gestion des catégories de la même façon que pour les albums (un album est une catégorie qu'on souhaite pouvoir traiter à part pour sa sémantique et son rôle).

# Step
Afficher les albums créés dans le menu album et faire le lien d'un clic sur un tag album pour ouvrir l'album correspondant.

# Step
Permettre d'associer une photo à un album.

# Step 
Afficher les photos par date.

# Step
Dans le fichier de propriétés des photos, ajouter les EXIF.

# Step
Pour chaque photo, créer un fichier contenant les propriétés de la photo (nom, emplacement, album, personnes, categories...).

# Step
Afficher uniquement le dernier répertoire du path (en utilisant un pipe ?) ~~et ajouter un badge contenant le nombre de photos.~~

## Step
A l'ajout d'un répertoire, ajouter le répertoire à la liste des répertoires, le sélectionner et afficher uniquement les photos de ce répertoire comme lorsqu'on clique sur un répertoire.

=> supprimer l'ajout continu de path dans le main et dans l'ihm.

# Configure Angular for electron
http://www.matthiassommer.it/software-architecture/webpack-node-modules/

# Notify model changes
Need to study the three solutions to determining which one to use in each situation.
For instance, use NgZone.run();
https://stackoverflow.com/questions/35105374/how-to-force-a-components-re-rendering-in-angular-2

# Database
https://github.com/louischatriot/nedb

"exif-reader": "github:inukshuk/exif-reader#patched",

# Tips
Il faut lancer l'appli angular en mode prod pour avoir les droits d'accès suffisants au disque (en mode ng serve, on passe par le navigateur normal qui n'a pas le droit d'accéder au disque).

# User Stories
## Importer un dossier photo
1. Fichier > Ajouter un dossier ;
2. Afficher le répertoire sous *Dossier* ;
3. Afficher les photos du dossier et de ses sous-dossier par date tirée des exifs (les photos sans exif ou sans date sont affichée à la date 00/00/0000).