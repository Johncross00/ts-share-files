import "dotenv/config";
import { exec } from "child_process";
import { URL } from "url";

const jsonServerUrl: string | undefined = process.env.VITE_JSON_SERVER_URL;
if (!jsonServerUrl) {
  console.error(
    "La variable VITE_JSON_SERVER_URL n'est pas définie dans le fichier .env."
  );
  process.exit(1);
}

const port: number = parseInt(new URL(jsonServerUrl).port, 10) || 3000;

console.log(`Démarrage de json-server sur le port ${port}...`);

exec(`json-server --watch db.json --port ${port}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur lors du lancement de json-server : ${error}`);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.error(stderr);
  }
});
