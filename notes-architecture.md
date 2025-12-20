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

/src/app/
    ├── pages/
        ├── home.component.ts
        ├── home.component.scss
        ├── home.component.html
        ├── home.component.spec.ts
        ├── country.component.ts
        ├── country.component.scss
        ├── country.component.html
        ├── country.component.spec.ts
        ├── not-found.component.ts
        ├── not-found.component.scss
        ├── not-found.component.html
        ├── not-found.component.spec.ts
    ├── components/
        ├── header.component.ts
        ├── header.component.scss
        ├── header.component.html
        ├── header.component.spec.ts
        ├── global-chart.component.ts
        ├── global-chart.component.scss
        ├── global-chart.component.html
        ├── global-chart.component.spec.ts
        ├── country-chart.component.ts
        ├── country-chart.component.scss
        ├── country-chart.component.html
        ├── country-chart.component.spec.ts
        ├── chart-colors.ts
    ├── services/
        ├── data.service.ts
    ├── models/
        ├── country.ts

## Explications

- Les **component** des différentes pages seront regroupés dans */src/app/pages*.
- Les  **component** briques servant à la constructiond des pages seront regroupés dans */src/app/components*.
- Les **model** seront regroupés dans */src/app/models*.
- Les **service** seront regroupés dans */src/app/services*.

- Des **component** Angular classic sont utilisés pour les pages et différents blocs qui les composent.
- Un **service** DataService sera implémenté via une classe en Singleton pour récupérer et rendre les données accessibles via un unique appel HTTP.
- Un **model** Country sera implémenté pour gérer les données des différents pays via des objets.

- Dans */src/app/components* un fichier *chart-colors.ts* est ajouté pour dissocier les couleurs des charts de la partie logique du code.