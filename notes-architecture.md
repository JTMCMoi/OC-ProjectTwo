# Architecture observée

A la racine du projet on trouve les déclarations globales de celui-ci :
- Point d'entrée de l'application TypeScript.
- Mise en page et style global.
- Les différents assets.

Le projet est ensuite regroupé au sein d'une **application** elle même découpée en **module**.
On y retrouve un **module** racine *AppModule* qui contient le **component** principal de l'application *AppComponent*.

Au sein du *AppComponent* sont déclarés des **component** correspondants aux différentes *pages* du projet au nombre de 3 :
- home : Page d'accueil.
- country : Page correspondant à l'affichage d'un pays donné.
- not-found : Page correspondant à l'erreur standard HTTP 404.

Chaque **component** contient :
- Sa logique TypeScript.
- Sa mise en page et son style.

Un **module** *app-routing* au sein de l' **application** vient compléter l'architecture pour gérer la relation : URLs <-> Page affichée.

# Problèmes identifiés

## Assets

- Contient une image/teleSport.png inutilisée à l'heure actuelle.

## Fonctionnels

- Un pays non trouvé ne redirrige pas vers une page affichant le **component** *not-found* mais affiche le *country* avec des données vides.
- En cas d'erreur lors de l'appel API, il n'y a pas de message à l'utilisateur mais seulement un log console.

## Architecturaux

Chaque **component** de *page* gère tout :
- Appel d'API via HTTP.
- Construction du graphique.

Ce qui provoque :
- Duplication de code : Pour récupérer les données via l'API.
- Intéraction avec la partie logique du code pour changer des propriétés d'un élément visuel comme les graphiques, donc source d'erreurs de code.

## Code

- xxx.component.ts, lors de l'appel HTTP :
    - Le résultat est un tableau de **any**.
    - Présence de **subscribe** sans **unsubscribe** d'un **Observable**.
    - Log console de l'erreur.

# Nouvelle architecture

## Arborescence

- /src/app/
    - pages/
    - components/
    - services/
    - models/

## Explications

- Les component des pages liés à une route seront regroupés dans le sous-dossier page.
- Les component briques servant à la constructiond des pages seront regroupés dans le sous-dossier components.
- Les services pour l'accès aux données seront regroupés dans le sous-dossier services et seront des singleton.
- Les différents éléments représentant des structures de données (interfaces, etc.) seront regroupés dans le sous-dossier models.