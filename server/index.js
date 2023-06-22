const express = require('express');
const verifyProof = require('../utils/verifyProof');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const bodyParser = require('body-parser'); // Ajout de body-parser

const port = 1225;

const app = express();
app.use(bodyParser.json()); // Utilisation de body-parser

// Construire l'arbre de Merkle à partir de la liste niceList
const leaves = niceList.map(name => Buffer.from(name, 'utf8'));
const tree = new MerkleTree(leaves, (a, b) => Buffer.concat([a, b]));

app.post('/gift', (req, res) => {
  const { name, proof } = req.body;

  // Vérifier la preuve en utilisant la fonction verifyProof
  const isValidProof = verifyProof(proof, Buffer.from(name, 'utf8'), tree.getRoot());
  console.log(isValidProof);
  if (isValidProof) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});