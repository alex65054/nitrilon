# KRAVSPECIFIKATION NITRILON
Kravspecifikationen opdeles i subsystems:

* Subsystem 01: Event Rating
* Subsystem 02: Medlemshåndtering
* Subsystem 03: Rollespilsgrupper

## Subsystem 01: Event Rating
Aktører:
* System: Den tablet og webpage som gæsten interagerer med. 
* Gæst: En person til Nitricon event.
* Eventansvarlig: den der skal have vist oversigterne over gæsternes bedømmelse.

01: En gæst skal kunne bedømme oplevelsen af et event, med valg af én værdi på en skala med tre niveauer.

02: Gæsten skal have feedback efter indtastningen af bedømmelsen, enten at det lykkedes eller ej.

03: Systemet skal automatisk klargøre til næste indtastning, efter en indtastning.

04: Den eventansvarlige skal kunne vælge et event for at få vist antallet af bedømmelser i hver bedømmelsesniveau.



# Ikke-funktionelle krav
Systemet skal overholde følgende ikke-funktionelle krav:

1. Databasen skal hostes på en Microsoft SQL Express Server 2019 på din lokale maskine.

2. Backend skal udvikles i C# med Visual Studio 2022.

3. Backend skal være en ASP.NET Core application med .NET 8 som runtime.

4. Backend skal hostes på en IIS Express på din lokale maskine til udvikling.

5. Backend skal til produktion kunne deployes på en Windows Server 2019 maskine på en IIS med .NET 8 som runtime.
    
6. Alle frontends skal udvikles i HTML5, CSS3 og javascript eller tilsvarende.
   
7a. Frontend til Event Rating skal designes til og kunne afvikles i en browser på en iOS tablet.

7b. Frontend til Event Rating skal designes til og kunne afvikles i en browser på en Android tablet.

8a. Frontend til medlemshåndtering skal designes til og kunne afvikles i Chrome desktop browser på Windows 10.

8b. Frontend til medlemshåndtering skal designes til og kunne afvikles i Edge desktop browser på Windows 10.

8c. Frontend til medlemshåndtering skal designes til og kunne afvikles i Firefox desktop browser på Windows 10.

9a. Frontend til rollespilsgrupper skal designes til og kunne afvikles i Chrome desktop browser på Windows 10.

9b. Frontend til rollespilsgrupper skal designes til og kunne afvikles i Edge desktop browser på Windows 10.

9c. Frontend til rollespilsgrupper skal designes til og kunne afvikles i Firefox desktop browser på Windows 10.

9d. Frontend til rollespilsgrupper skal designes til og kunne afvikles i Safari mobil browser på iOS.

9e. Frontend til rollespilsgrupper skal designes til og kunne afvikles i Chrome mobil browser på Android.

10a. Kommunikation mellem klient og server skal anvende HTTP eller HTTPS som protokol.

10b. Kommunikation mellem klient og server skal anvende JSON som dataformat.

NOTE: Der skal ikke tages hensyn til sikkerhed, GDPR, kryptering mv., da det ligger uden for fagets mål.