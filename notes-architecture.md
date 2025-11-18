# Notes d'Architecture --- Audit du Code Angular (v18)

## 1. Appels HTTP dans les composants

-   `HttpClient` utilisé directement dans les composants.
-   URL API `./assets/mock/olympic.json` répétée dans plusieurs
    fichiers.
-   Logique métier, parsing et gestion d'erreurs dupliquées.

**Recommandation :** Créer un service dédié :
**DataService** - Centralise les appels HTTP - Lit l'URL
depuis `environment.apiUrl` - Expose des méthodes typées
(`getResults()`, `getCountryResult(...)`)

------------------------------------------------------------------------

## 2. Typage insuffisant

-   Beaucoup de `any`
-   Perte de la robustesse TypeScript

**Recommandation :** Créer un modèle unique basé sur l'endpoint :
`models/olympic-results.model.ts`

------------------------------------------------------------------------

## 3. Logique métier dans les composants

-   Calculs, agrégations et transformations directement dans
    `ngOnInit()`
-   Composants trop lourds et peu testables

**Recommandation :** Déporter toutes les règles métier dans
`DataService`.

------------------------------------------------------------------------

## 4. Gestion des Observables

-   Souscriptions imbriquées
-   `.pipe()` inutiles
-   Aucun désabonnement → fuite mémoire potentielle

**Recommandation :** - Utiliser `async` pipe quand possible - Sinon
`takeUntil(destroy$)` - Remplacer les souscriptions imbriquées par
`switchMap`

------------------------------------------------------------------------

## 5. Logging

-   `console.log` présents dans les composants

**Recommandation :** Créer un **LoggerService** : - Dev → log console -
Prod → silencieux ou futur connecteur (ELK/APM) - Aucun `console.log`
direct dans les composants

------------------------------------------------------------------------

## 6. Code dupliqué

-   URL API
-   Transformations
-   Gestion des erreurs

**Recommandation :** Centraliser dans `DataService`.

------------------------------------------------------------------------

## 7. Logique de présentation des graphiques

-   Config Chart.js directement dans les composants
-   Composants volumineux

**Recommandation :** Créer **ResultatsChartService** - Génère la
configuration Chart.js - Le composant gère uniquement le canvas et
l'appel au service

------------------------------------------------------------------------

## 8. Structure du projet

Structure cible :

    src/app/
      core/
        models/
          olympic-results.model.ts
        services/
          olympic-resultats.service.ts
          resultats-chart.service.ts
          logger.service.ts
          http-error.interceptor.ts
      shared/
        components/
      pages/
        home/
        country/

------------------------------------------------------------------------

## 9. Gestion des erreurs HTTP

-   Fait localement dans chaque composant

**Recommandation :** Créer un intercepteur : - Uniformise les erreurs -
Convertit les messages techniques en messages UX-friendly

------------------------------------------------------------------------

## 10. UI --- Problèmes analysés

### 10.1. Pas d'animations de transition

Transitions brusques.

### 10.2. Mauvaise gestion d'un pays invalide

Aucune page d'erreur dédiée.

### 10.3. Favicon par défaut

Toujours celui d'Angular.

### 10.4. Content shift (CLS)

Le contenu "saute" lors du chargement.

### 10.5. Header non homogène

Le header change entre les pages.

### 10.6. Graphique trop petit sur mobile

Manque d'adaptation responsive.

**Recommandations :** - Ajouter des animations Angular - Utiliser un
resolver + page erreur - Remplacer le favicon - Fixer une hauteur
minimale du layout - Extraire un composant Header partagé - Utiliser
`BreakpointObserver` pour adapter la hauteur du conteneur du graphique

------------------------------------------------------------------------

## 11. UX

### 11.1. Breadcrumbs

Ajouter des breadcrumbs pour faciliter la navigation : `Home / Country`

------------------------------------------------------------------------

## 12. Loader & Optimisation

### 12.1. Loader

Pas d'indicateur de chargement.

### 12.2. Optimisation page pays

Même JSON chargé deux fois.

**Recommandation :** - Ajouter un loader - Mettre un cache dans le
service - Utiliser un route resolver pour précharger les données

------------------------------------------------------------------------

## 13. Version Angular et migration

Le projet utilise **Angular 18**, version en fin de support LTS dans
quelques jours.

**Recommandation :** Préparer une migration vers **Angular 19** ou
**Angular 20**.

### Adopter dès maintenant :

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private http = inject(HttpClient);

------------------------------------------------------------------------

## Résumé

Actions prioritaires : 1. Centralisation HTTP, logique métier, affichage
graphiques et logging\
2. Nettoyage des composants et amélioration des Observables\
3. Fix UI/UX : header, loader, transitions, breadcrumbs, responsive
graphique\
4. Préparation migration Angular 19/20
