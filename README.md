# Tradeline Solution - site statique

public/index.html      site en francais  (/)
public/en/index.html   site en anglais   (/en/)
wrangler.jsonc         configuration Cloudflare (aucun serveur a gerer)

## Formulaire de contact (Web3Forms)
1. Sur web3forms.com, saisir info@tradels.com : la cle d'acces est envoyee par e-mail.
2. Dans public/index.html ET public/en/index.html, remplacer VOTRE_CLE_ACCES_WEB3FORMS par cette cle.
   (La cle est publique par conception : elle ne revele pas l'adresse e-mail.)
3. Deployer (npx wrangler deploy ou via Git).

Anti-spam : champ piege cache + filtre anti-spam de Web3Forms. Option gratuite : activer hCaptcha dans le tableau de bord Web3Forms.
