const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
// As we do not have the database structure for the volunteers, yet, we are using the good old json file, but it is just for now, I promisse!
// const connect = require('../config/connectMySQL');
const volunteersDB = require('../assets/jsonDB/volunteers.json');
const fs = require("fs"); 

function read(req, res) {
    res.send(volunteersDB);
}

function findVolunteerById(volunteerId) {
    const volunteer = volunteersDB.filter(volunteerDB => {
        return volunteerDB.volunteerId == volunteerId;
    });

    if (volunteer.length < 1) {
        return false;
    }

    return volunteer[0];
}

function writeJsonFile(newVolunteersContent, res) {
    const sortedVolunteersContent = newVolunteersContent.sort(function(a, b){return a.volunteerId - b.volunteerId});

    fs.writeFile("assets/jsonDB/volunteers.json", JSON.stringify(sortedVolunteersContent), 'utf8', err => {
        if (err) {
            return res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);            
        };

        return res.send(jsonMessages.db.successInsert);
    });
}

function readID(req, res) {
    const volunteerId = req.sanitize('id').escape();
    const volunteer = findVolunteerById(volunteerId);
    
    if (!volunteer) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }

    res.send(volunteer);
}

function save(req, res) {
    const name = req.sanitize('name').escape();
    const email = req.sanitize('email').escape();
    const moreInfo = req.sanitize('moreInfo').escape();
    req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (name != 'NULL' && email != 'NULL' && typeof(name) != 'undefined' && typeof(email) != 'undefined') {
            const newVolunteer = {
                "volunteerId": volunteersDB.length + 1,
                "name": name,
                "email": email, 
                "moreInfo": moreInfo,
                "isActive": true        
            }
            volunteersDB.push(newVolunteer);

            writeJsonFile(volunteersDB, res);
        } else {
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    }
}

function update(req, res) {
    const idVolunteer = req.sanitize('id').escape();
    const currentVolunteer = findVolunteerById(idVolunteer);
    if(!currentVolunteer) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }

    const name = req.sanitize('name').escape();
    const email = req.sanitize('email').escape();
    const moreInfo = req.sanitize('moreInfo').escape();
    req.checkBody("name", "Insira apenas texto").matches(/^[a-z ]+$/i);
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idVolunteer != 'NULL' && name != 'NULL' && email != 'NULL' && typeof(name) != 'undefined' && typeof(email) != 'undefined') {
            const updatedVolunteer = {
                "volunteerId": currentVolunteer.volunteerId,
                "name": name,
                "email": email, 
                "moreInfo": moreInfo,
                "isActive": true
            };
            const oldPosition = volunteersDB.indexOf(currentVolunteer);
            volunteersDB.splice(oldPosition, 1);
            volunteersDB.push(updatedVolunteer);

            writeJsonFile(volunteersDB, res);
        }
        else {
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
        }
    }
}

function deleteL(req, res) {
    const idVolunteer = req.sanitize('id').escape();
    const currentVolunteer = findVolunteerById(idVolunteer);
    if(!currentVolunteer) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
    const currentPosition = volunteersDB.indexOf(currentVolunteer);
    volunteersDB.splice(currentPosition, 1);
    currentVolunteer.isActive = false;
    volunteersDB.push(currentVolunteer);
    writeJsonFile(volunteersDB, res);
}

function deleteF(req, res) {
    const idVolunteer = req.sanitize('id').escape();
    const currentVolunteer = findVolunteerById(idVolunteer);
    if(!currentVolunteer) {
        res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
    }
    const currentPosition = volunteersDB.indexOf(currentVolunteer);
    volunteersDB.splice(currentPosition, 1);
    writeJsonFile(volunteersDB, res);
}

module.exports = {
    read: read,
    readID: readID,
    save: save,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
};
