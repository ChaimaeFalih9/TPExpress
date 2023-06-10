const stripe = require('stripe');
const express = require('express');
const jwt = require('jsonwebtoken');

// Fonction de vérification du JWT Bearer
const verifyToken = (req) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, 'YOUR_JWT_SECRET');
            return decoded;
        }
    catch (error) {
        throw new Error('Token invalide');
    }
} else {
    throw new Error('Header d\'autorisation manquant');
  }
};
const desabonnement = (req, res) => {
    try {
        const decodedToken = verifyToken(req);
        const userId = decodedToken.userId;
        User.findByIdAndUpdate(userId, { estAbonne: false }, (err, user) => {
            if (err) {
                throw new Error('Erreur lors de la mise à jour de l abonnement');
            }
            res.send('Vous avez été désabonné avec succès.');
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
      }
};


const modifierAbonnement = async (req, res) => {
    try {
        const decodedToken = verifyToken(req);
        const abonnementId = req.params.id;

        const subscription = await stripe.subscriptions.retrieve(abonnementId);
        await stripe.subscriptions.update(abonnementId, {
            items: [
                {
                  id: subscription.items.data[0].id,
                  plan: 'NOUVEAU_Prix',
                  quantity: 2
                }
              ],
              metadata: {
                key: 'value'
              },
            });


        res.send(`Abonnement ${abonnementId} modifié avec succès.`);
    } catch (error) {
        res.status(401).json({ error: error.message });
      }
    };

module.exports = {
    unsubscribe,
    modifierAbonnement
  };