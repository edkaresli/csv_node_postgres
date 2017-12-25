
var fs = require('fs');
var csv = require('fast-csv');
const pool = require('./pgdb');

pool.connect(function(err){
    if(err)
    {
        console.log(err);
    }
});

let counter = 0; 

// let header = [];
// let data = [];

let csvStream = csv.fromPath(".\\csv\\FL_insurance_sample.csv", { headers: true })
    .on("data", function(record){
        csvStream.pause();

        if(counter < 100)
        {
            let policyID = record.policyID;
            let statecode = record.statecode;
            let county = record.county;
            let point_latitude = record.point_latitude;
            let point_longitude = record.point_longitude;
            let line = record.line;
            let construction = record.construction;

            pool.query("INSERT INTO FL_insurance_sample(policyID, statecode, county, point_latitude, point_longitude, line, construction) \
            VALUES($1, $2, $3, $4, $5, $6, $7)", [policyID, statecode, county, point_latitude, point_longitude, line, construction], function(err){
                if(err)
                {
                    console.log(err);
                }
            });
            ++counter;
        }

        csvStream.resume();

    }).on("end", function(){
        console.log("Job is done!");
    }).on("error", function(err){
        console.log(err);
    });