const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // Votre nom à vérifier
  const yourName = "Norman Block";

  // Construire l'arbre de Merkle à partir de la liste niceList
  const leaves = niceList.map(name => Buffer.from(name, 'utf8'));
  const tree = new MerkleTree(leaves, (a, b) => Buffer.concat([a, b]));

  // Récupérer l'index de votre nom dans la liste
  const index = niceList.indexOf(yourName);
  if (index === -1) {
    console.log(`Votre nom "${yourName}" n'est pas dans la liste.`);
    return;
  }

  // Récupérer la preuve (Merkle proof) pour votre nom
  const proof = tree.getProof(index);

  // Convertir la preuve en une chaîne de caractères JSON
  const proofJSON = JSON.stringify(proof);


// Vérifier la preuve en envoyant une requête au serveur
const { data: gift } = await axios.post(`${serverUrl}/gift`, {
  name: yourName,
  proof: JSON.parse(proofJSON)  // Convertir la preuve en objet JavaScript
});

  console.log({ gift });
}

main();