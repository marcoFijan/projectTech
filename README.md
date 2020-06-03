# Project Tech
In dit project maak ik een feature voor een datingwebsite. In mijn geval is dit een datingwebsite voor geeks. Op deze datingwebsite kun je een bestaande profiel selecteren en 'inloggen'. Hier kom je op een unieke indexpagina. 

## Inloggen
[![sign-in.png](https://i.postimg.cc/8zCG1mMp/sign-in.png)](https://postimg.cc/3dzV1ptV)

## Overzichtspagina
[![index.png](https://i.postimg.cc/ZRNZGY36/index.png)](https://postimg.cc/R6vjfBg0)

## Profielpagina
[![profile.png](https://i.postimg.cc/gjqp0MgJ/profile.png)](https://postimg.cc/2L6McxRR)

## Job Story
_Wanneer ik op een profiel klik, wil ik gelijk de eigenschappen van die persoon zien, zodat ik meteen kan zien of ik de persoon leuk vind._

## Features
* Inloggen in bestaande account zonder wachtwoord
* Overzichtelijk inzien van profielen die interesses met je delen en die online zijn
* Aanklikken van deze profielen opent een profielpagina aan de hand van 1 profile-template
* Mogelijkheid om je profielgegevens te wijzigen 
* Mogelijkheid om een ander profiel te verwijderen
* Mogelijkheid om een ander profiel toe te voegen

## Gebruikte NPM pakketten
### Regular dependencies
- body-parser, om lokale data uit formulieren te halen
- dotenv, zodat niet iedereen de gevoelige informatie kan bekijken
- ejs, templating engine voor gemak en een kleiner project grootte
- express, voor het creeëren en opvangen van routes
- express-session, om cache van verschillende gebruikers op te slaan
- mongodb, om de connectie te maken met de database

### Developer dependencies
- eslint, om veelgemaakte coderingsfouten te voorkomen
- nodemon, zodat na elke wijziging in de server, de server automatisch opnieuw wordt opgestart

## Install Guide
### STAP 1: Creeër een lokale git repo
Navigeer met uw terminal naar de gewenste folder, waar u het project wilt kopieren, door: 
```
cd "foldername"
```
te gebruiken. _Waar "foldername" staat vul je dan de naam van de folder in._ 
Gebruik daarna eventueel de command: 
```
mkdir "foldername"
```
Om een nieuwe folder aan te maken. _"foldername wordt in dit geval de naam van de nieuwe folder"_

Als u ook wijzigingen wilt doorvoeren, voert u de command: 
```
git init
```
uit om een werkende git repo te creeëren. 

### STAP 2: git clone
Om dit project lokaal op uw computer op te slaan, gebruikt u de command
```
git clone https://github.com/marcoFijan/projectTech.git
```
Vervolgens worden automatisch alle bestanden naar uw huidige folder gedownload

### STAP 3: Node
Om dit project uit te voeren, heeft u node nodig. Hiervoor voert u de volgende commands in:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```
En vervolgens
```
nvm install stable
```
Voor meer informatie, bezoekt u de website van [node](https://www.npmjs.com/get-npm)

### STAP 4: Packages
Om alle gebruikte packages in dit project te installeren. Gebruikt u simpelweg dit ene command:
```
npm install
```
Node gaat dat automatisch opzoek naar alle packages die in dit project zitten en installeerd deze voor u. 

### STAP 5: Run
Wanneer alle packages zijn gedownload kunt u de het project opstarten met:
```
npm start
```
Vervolgens geeft de terminal aan op welke port u dit project kunt bereiken

## Bronnen
- Academind. (2016, April 5). Node.js + Express - Tutorial - Update and Delete Data with MongoDB. Retrieved May 31, 2020, from https://www.youtube.com/watch?v=-JcgwLIh0Z4
- Code Realm. (2018, November 17). Session Authentication in Express. Retrieved May 28, 2020, from https://www.youtube.com/watch?v=OH6Z0dJ_Huk&t=1s
- Dev Ed. (2019, May 11). Build A Restful Api With Node.js Express & MongoDB | Rest Api Tutorial. Retrieved May 30, 2020, from https://www.youtube.com/watch?v=vjf774RKrLc&t=1243s
- Filter out array to have only unique values. (2016, July 5). Retrieved May 29, 2020, from https://stackoverflow.com/questions/38206915/filter-out-array-to-have-only-unique-values
- Fun Fun Function. (2015a, August 3). Closures - Part 5 of Functional Programming in JavaScript. Retrieved May 26, 2020, from https://www.youtube.com/watch?v=CQqwU2Ixu-U&t=324s
- Fun Fun Function. (2015b, August 31). Promises - Part 8 of Functional Programming in JavaScript. Retrieved May 30, 2020, from https://www.youtube.com/watch?v=2d7s3spWAzo&t=186s
- Fun Fun Function. (2017, August 21). Error handling Promises in JavaScript - Fun Fun Function. Retrieved May 30, 2020, from https://www.youtube.com/watch?v=f8IgdnYIwOU&t=190s
- Junior Developer Central. (2019, July 1). NodeJS Essentials 33: Express Sessions. Retrieved May 26, 2020, from https://www.youtube.com/watch?v=hKYjSgyCd60&t=233s
- mmtuts. (2017, February 10). Add A Favicon to A Website in HTML | Learn HTML and CSS | HTML Tutorial | HTML for Beginners. Retrieved June 1, 2020, from https://www.youtube.com/watch?v=kEf1xSwX5D8
- Programming with Mosh. (2018, May 15). JavaScript Array Filter. Retrieved May 29, 2020, from https://www.youtube.com/watch?v=4_iT6EGkQfk
- Robin Pokorny. (2018, September 20). Remove duplicates from array in JavaScript – the only right way. Retrieved May 29, 2020, from https://www.youtube.com/watch?v=bRpVR1x_O8Q
- rudolfson.junior. (2016, July 13). Serve static files with Express - Node.js. Retrieved May 27, 2020, from https://www.youtube.com/watch?v=Hk2LkOD7ZH0
- The Net Ninja. (2016a, July 8). Node JS Tutorial for Beginners #30 - Handling POST Requests. Retrieved May 26, 2020, from https://www.youtube.com/watch?v=rin7gb9kdpk&t=318s
- The Net Ninja. (2016b, July 8). Node JS Tutorial for Beginners #30 - Handling POST Requests. Retrieved May 30, 2020, from https://www.youtube.com/watch?v=rin7gb9kdpk
- The Net Ninja. (2017, January 30). MongoDB Tutorial #14 - Update Operators. Retrieved May 29, 2020, from https://www.youtube.com/watch?v=DeAWKJJng30&t=98s
- Web Dev Simplified. (2019, January 17). JavaScript Promises In 10 Minutes. Retrieved May 30, 2020, from https://www.youtube.com/watch?v=DHvZLI7Db8E&t=419s
- Wes Bos. (2019, March 12). ESLint + Prettier + VS Code — The Perfect Setup. Retrieved May 26, 2020, from https://www.youtube.com/watch?v=lHAeK8t94as&t=597s
