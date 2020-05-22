const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
// As we do not have the database structure for the comitee, yet, we are using the good old json file, but it is just for now, I promisse!
// const connect = require('../config/connectMySQL');
const comiteeDB = require('../assets/jsonDB/comitee.json');
const fs = require("fs"); 

function read(req, res) {
    res.send(comiteeDB);
}

function findComiteeById(comiteeId) {
    const comitee = comiteeDB.filter(comiteeDB => {
        return comiteeDB.comiteeId == comiteeId;
    });

    if (comitee.length < 1) {
        return false;
    }

    return comitee[0];
}

function writeJsonFile(newComiteeContent, res) {
    const sortedComiteeContent = newComiteeContent.sort(function(a, b){return a.comiteeId - b.comiteeId});

    fs.writeFile("assets/jsonDB/comitee.json", JSON.stringify(sortedComiteeContent), 'utf8', err => {
        if (err) {
            return res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);            
        };

        return res.send(jsonMessages.db.successInsert);
    });
}

function readID(req, res) {
    const comiteeId = req.sanitize('id').escape();
    const comitee = findComiteeById(comiteeId);
    
    if (!comitee) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }

    res.send(comitee);
}

function save(req, res) {
    const name = req.sanitize('name').escape();
    const moreInfo = req.sanitize('moreInfo').escape();
    req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (name != 'NULL' && typeof(name) != 'undefined') {
            const newComitee = {
                "comiteeId": comiteeDB.length + 1,
                "name": name,
                "moreInfo": moreInfo,
                "isActive": true
            }
            comiteeDB.push(newComitee);

            writeJsonFile(comiteeDB, res);
        } else {
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    }
}

function update(req, res) {
    const idComitee = req.sanitize('id').escape();
    const currentComitee = findComiteeById(idComitee);
    if(!currentComitee) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }

    const name = req.sanitize('name').escape();
    const moreInfo = req.sanitize('moreInfo').escape();
    req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idComitee != 'NULL' && name != 'NULL' && typeof(name) != 'undefined') {
            const updatedComitee = {
                "comiteeId": currentComitee.comiteeId,
                "name": name,
                "moreInfo": moreInfo,
                "isActive": true
            };
            const oldPosition = comiteeDB.indexOf(currentComitee);
            comiteeDB.splice(oldPosition, 1);
            comiteeDB.push(updatedComitee);

            writeJsonFile(comiteeDB, res);
        }
        else {
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
        }
    }
}

function deleteL(req, res) {
    const idComitee = req.sanitize('id').escape();
    const currentComitee = findComiteeById(idComitee);
    if(!currentComitee) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
    const currentPosition = comiteeDB.indexOf(currentComitee);
    comiteeDB.splice(currentPosition, 1);
    currentComitee.isActive = false;
    comiteeDB.push(currentComitee);
    writeJsonFile(comiteeDB, res);
}

function deleteF(req, res) {
    const idComitee = req.sanitize('id').escape();
    const currentComitee = findComiteeById(idComitee);
    if(!currentComitee) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
    const currentPosition = comiteeDB.indexOf(currentComitee);
    comiteeDB.splice(currentPosition, 1);
    writeJsonFile(comiteeDB, res);
}

module.exports = {
    read: read,
    readID: readID,
    save: save,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
};
