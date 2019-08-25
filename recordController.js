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
        if (validateRequest(request)) {
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
                            code: 1,
                            msg: 'no records found',
                            records: []
                        }
                    )
                }
            });
        } else {
            res.status(400).send({
                code: 2,
                msg: 'bad request',
                records: []
            })
        }

    } catch (err) {
        res.status(500).send(
            {
                code: 3,
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
    if (isValidDate(startDate) && isValidDate(endDate) && validator.isBefore(startDate, today) && (validator.isBefore(endDate, today) || validator.equals(endDate, today)) && validator.isAfter(endDate, startDate) && validator.isInt(minCount) && validator.isInt(maxCount) && +minCount < +maxCount && 0 <= +minCount && 0 < +maxCount) {
        return true;
    } else {
        return false;
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