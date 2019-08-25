// recordController.js

// import record model
record = require('./recordModel');

// import validator library
var validator = require('validator');

// handle search record actions
exports.search = function (req, res) {
    var request = req.body;
    try {
        // validating request payload params
        if (validateRequest(request).code == 3) {
            // get desired data whether if request params are valid
            getRecords(request).then(records => {
                if (records) {
                    res.status(200).send(
                        {
                            code: 0,
                            msg: 'success',
                            records: records
                        }
                    )

                } else {
                    res.status(204).send(
                        {
                            code: 2,
                            msg: 'no records found',
                            records: []
                        }
                    )
                }
            });
        } else {
            res.status(400).send({
                code: validateRequest(request).code,
                msg: validateRequest(request).msg,
                records: []
            })
        }

    } catch (err) {
        res.status(500).send(
            {
                code: 1,
                msg: err,
                records: []
            }
        )
    }
};

// validation method
function validateRequest(requestPayload) {
    var { startDate, endDate, minCount, maxCount } = requestPayload;
    var today = new Date().toISOString().slice(0, 10);

    if (!isValidDate(startDate)) {
        return { code: 4, msg: 'invalid start date' };
    } else if (!isValidDate(endDate)) {
        return { code: 5, msg: 'invalid end date' };
    }
    else if (!validator.isBefore(startDate, today)) {
        return { code: 6, msg: 'start date must be before today' };
    }
    else if (!(validator.isBefore(endDate, today) || validator.equals(endDate, today))) {
        return { code: 7, msg: 'end date must be today or before' };
    }
    else if (!validator.isAfter(endDate, startDate)) {
        return { code: 8, msg: 'end date must be after start date' };
    }
    else if (!validator.isInt(minCount)) {
        return { code: 9, msg: 'min count must be integer' };
    }
    else if (!validator.isInt(maxCount)) {
        return { code: 10, msg: 'max count must be integer' };
    }
    else if (!(+minCount < +maxCount)) {
        return { code: 11, msg: 'max count must be bigger that min count' };
    }
    else if (!(0 <= +minCount && 0 < +maxCount)) {
        return { code: 12, msg: 'min or max count cannot be smaller than zero' };
    } else {
        return { code: 3, msg: 'valid request' };
    }
};

function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) {
        return false;
    } // invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) {
        return false;
    } // NaN value, invalid date
    return d.toISOString().slice(0, 10) === dateString;
};

// getting filtered data from database
async function getRecords(requestPayload) {
    var { startDate, endDate, minCount, maxCount } = requestPayload;
    let records;

    try {
        await record.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            }, {
                $project: {
                    key: 1,
                    _id: 0,
                    createdAt: 1,
                    totalCount: {
                        $sum: '$counts'
                    }
                }
            }, {
                $match: {
                    totalCount: {
                        $gt: parseInt(minCount),
                        $lt: parseInt(maxCount)
                    }
                }
            }
        ], (err, result) => {
            if (err) {
                records = false;
            } else {
                records = result;
            }
        });
    } catch (err) {
        records = false;
    }
    return records;
};