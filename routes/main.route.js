const router = require('express').Router();
const controllerSpeaker = require('../controllers/speaker.controller.js');
const controllerSponsor = require('../controllers/sponsor.controller.js');
const controllerConference = require('../controllers/conference.controller.js');
const controllerMail = require('../controllers/mail.controller.js');
const controllerComitee = require('../controllers/comitee.controller.js');
const controllerVolunteer = require('../controllers/volunteer.controller.js');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
router.get('/', function(req, res) {
    res.send("FCA Book");
    res.end();
});

router.get('/speakers/', controllerSpeaker.read);
router.get('/speakers/:id', controllerSpeaker.readID);
router.post('/speakers/', isLoggedIn, controllerSpeaker.save);
router.put('/speakers/:id', isLoggedIn, isLoggedIn, controllerSpeaker.update);
router.put('/speakers/del/:id', isLoggedIn, controllerSpeaker.deleteL);
router.delete('/speakers/:id', isLoggedIn, controllerSpeaker.deleteF);

router.get('/sponsors/', controllerSponsor.read);
router.get('/sponsors/:id', controllerSponsor.readID);
router.post('/sponsors/', isLoggedIn, controllerSponsor.save);
router.put('/sponsors/:id', isLoggedIn, controllerSponsor.update);
router.put('/sponsors/del/:id', isLoggedIn, controllerSponsor.deleteL);
router.delete('/sponsors/:id', isLoggedIn, controllerSponsor.deleteF);

router.get('/conferences', controllerConference.readConference);
router.get('/conferences/:id', controllerConference.readConferenceID);

router.get('/conferences/:idconf/participants', controllerConference.readParticipant);
router.post('/conferences/:idconf/participants/:idparticipant/', controllerConference.saveParticipant);
router.delete('/conferences/:idconf/participants/:idparticipant', controllerConference.deleteParticipant);

router.get('/conferences/:idconf/sponsors/', controllerConference.readSponsor);
router.post('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.saveSponsor);
router.delete('/conferences/:idconf/sponsors/:idsponsor', isLoggedIn, controllerConference.deleteSponsor);

router.get('/conferences/:idconf/speakers/', controllerConference.readSpeaker);
router.post('/conferences/:idconf/speakers/:idspeaker', isLoggedIn, controllerConference.saveSpeaker);
router.delete('/conferences/:idconf/speakers/:idspeaker', controllerConference.deleteSpeaker);

router.post('/contacts/emails', controllerMail.send);

// comitee endpoints
router.get('/comitee/', controllerComitee.read);
router.get('/comitee/:id', controllerComitee.readID);
router.post('/comitee/', isLoggedIn, controllerComitee.save);
router.put('/comitee/:id', isLoggedIn, controllerComitee.update);
router.put('/comitee/del/:id', isLoggedIn, controllerComitee.deleteL);
router.delete('/comitee/:id', isLoggedIn, controllerComitee.deleteF);

// volunteers endpoints
router.get('/volunteers/', controllerVolunteer.read);
router.get('/volunteers/:id', controllerVolunteer.readID);
router.post('/volunteers/', isLoggedIn, controllerVolunteer.save);
router.put('/volunteers/:id', isLoggedIn, controllerVolunteer.update);
router.put('/volunteers/del/:id', isLoggedIn, controllerVolunteer.deleteL);
router.delete('/volunteers/:id', isLoggedIn, controllerVolunteer.deleteF);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
        return next();
    }
}
