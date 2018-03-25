/**
 * Importing Request module
 */
const request = require('request');

/**
 * Defining function for fetching word definition from wordnik API
 */
const fetchWordDefinition = (word) => {
    request
        .get("http://api.wordnik.com:80/v4/word.json/" + word + "/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
        .on('response', (response) => {
            console.log(response.body);
        })
        .on('error', (error) => {
            console.log(error.message);
        });
}

/**
 * Exporting the fitching function
 */
module.exports = { fetchWordDefinition };