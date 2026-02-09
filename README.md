# groepsscore
Groepsscore maakt deelname in Facebook-groepen zichtbaar met punten en rangschikkingen. Eenvoudig, transparant en bedoeld om samen actief te blijven.



**Puntensysteem en leaderboard voor een community**  
_(onder constructie)_

Groepscore is een platform-onafhankelijk, lokaal bruikbaar systeem om posts en reacties
in een community te belonen met punten. Het is losgekoppeld van Facebook of andere
platform-API’s zodat de kernlogica en anti-spam werking eerst getest kan worden.

📌 Deze repo bevat de volledige core-logica, admin-tools en simulators, zodat je
klaar staat zodra je toegang hebt tot de Facebook Group API.

---

## 📌 Status

🟡 **Onder constructie** — de kern werkt lokaal, maar de Facebook-integratie moet nog toegevoegd worden zodra de juiste toegang mogelijk is.

---

## ✅ Prerequisites

- **Node.js 20+ (LTS)**  
- **npm** (meekomend met Node.js)

---

## ▶️ Installeren, bouwen en draaien

```bash
npm install
npm run build
npm start
```

**Overige scripts**
```bash
npm test
npm run leaderboard
npm run export
```

---

## 🔗 Webhook-contract (Facebook events)

Verwacht Facebook event:
```json
{
  "type": "post" | "comment",
  "userId": "string",
  "timestamp": 0,
  "postId": "string?"
}
```

---

## 📂 Overzicht van de projectstructuur

- `src/` — TypeScript core-logica, routes en scripts.  
- `data/` — Lokale dataopslag (o.a. SQLite).  
- `dist/` — Gebouwde output (TypeScript → JavaScript).

---

## 🌐 Server host & poort

Standaard start de server op **`0.0.0.0:8080`**.  
Je kunt dit aanpassen via de env vars: **`HOST`** en **`PORT`** (zie `src/server.ts`).

---

## 🔐 GitHub SSH instellen op Windows (kort)

Als `ssh-keygen` in PowerShell niet bestaat, ontbreekt de **OpenSSH Client**. Installeer
die eerst en maak daarna je key aan.

**OpenSSH Client installeren**
1. **Instellingen → Apps → Optionele onderdelen → Functie toevoegen**
2. Kies **OpenSSH Client** en installeer.

Alternatief via PowerShell (Admin):
```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

**Daarna: SSH key genereren**
```powershell
ssh-keygen -t ed25519 -C "jouw-email@voorbeeld.com"
```
