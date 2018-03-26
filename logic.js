/**
 * Importing Request module
 */
const request = require('request');
const async = require('async');
const chalk = require('chalk');

/**
 * Defining function for fetching word definition from wordnik API
 */
const fetchWordDefinition = (word, parentCallback) => {
    let URI = "http://api.wordnik.com:80/v4/word.json/" + word.toLowerCase() + "/definitions?limit=4&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    //console.log("URL is :- " + URI);
    request.get({
        "encoding": "utf-8",
        "method": "GET",
        "uri": URI,
        "followRedirect": false
    }, function(err, res, body) {
        try {
            let jsonArray = JSON.parse(body);
            let defArray = new Array();
            async.each(jsonArray, function(value, callback) {
                defArray.push(value.text);
                callback();
            }, function(error) {
                if (defArray) {
                    // console.log(exArray.join('\n'));
                    parentCallback(defArray.join('\n'));
                } else {
                    // console.log("No examples found for %s, please try other word!", word.toLowerCase());
                    parentCallback("No examples found for " + word.toLowerCase() + ", please try other word!");
                }
            });
        } catch (error) {
            parentCallback("Unable to fitch the defination of " + word.toLowerCase() + ", please try again!");
        }

    });

};

/**
 * Defining function to fetch word synonyms
 */
const fetchWordSynonyms = (word, parentCallback) => {
    let URI = "http://api.wordnik.com:80/v4/word.json/" + word.toLowerCase() + "/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    //console.log("URL is :- " + URI);
    request.get({
        "encoding": "utf-8",
        "method": "GET",
        "uri": URI,
        "followRedirect": false
    }, function(err, res, body) {
        try {
            let jsonArray = JSON.parse(body);
            let syn;
            async.each(jsonArray, function(value, callback) {
                if (value.relationshipType == "synonym") {
                    syn = value.words.join('\n');
                }
                callback();
            }, function(error) {
                if (syn) {
                    parentCallback(syn);
                } else {
                    parentCallback("No synonyms found for " + word.toLowerCase() + ", please try other word!");
                }
            });
        } catch (error) {
            parentCallback("Unable to fitch the synonyms of " + word.toLowerCase() + ", please try again!");
        }

    });

};


/**
 * Defining function to fetch word antonyms
 */
const fetchWordAntonyms = (word, parentCallback) => {
    let URI = "http://api.wordnik.com:80/v4/word.json/" + word.toLowerCase() + "/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    //console.log("URL is :- " + URI);
    request.get({
        "encoding": "utf-8",
        "method": "GET",
        "uri": URI,
        "followRedirect": false
    }, function(err, res, body) {
        try {
            let jsonArray = JSON.parse(body);
            let ant;
            async.each(jsonArray, function(value, callback) {
                if (value.relationshipType == "antonym") {
                    ant = value.words.join("\n");
                }
                callback();
            }, function(error) {
                if (ant) {
                    parentCallback(ant);
                } else {
                    parentCallback("No antonym found for " + word.toLowerCase() + ", please try other word!");
                }
            });

        } catch (error) {
            parentCallback("Unable to fitch the antonym of " + word.toLowerCase() + ", please try again!");
        }

    });

};


/**
 * Defining function to fetch word Examples
 */
const fetchWordExamples = (word, parentCallback) => {
    let URI = "http://api.wordnik.com:80/v4/word.json/" + word.toLowerCase() + "/examples?includeDuplicates=false&useCanonical=false&skip=0&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
        //console.log("URL is :- " + URI);
    request.get({
        "encoding": "utf-8",
        "method": "GET",
        "uri": URI,
        "followRedirect": false
    }, function(err, res, body) {
        try {
            let json = JSON.parse(body);
            let examplesArray = json.examples;
            let exArray = new Array();
            async.each(examplesArray, function(value, callback) {
                exArray.push(value.text);
                callback();
            }, function(error) {
                if (exArray) {
                    // console.log(exArray.join('\n'));
                    parentCallback(exArray.join('\n'));
                } else {
                    // console.log("No examples found for %s, please try other word!", word.toLowerCase());
                    parentCallback("No examples found for " + word.toLowerCase() + ", please try other word!");
                }
            });

        } catch (error) {
            //console.log("Unable to fitch the examples of %s, please try again!", word.toLowerCase());
            parentCallback("Unable to fitch the examples of " + word.toLowerCase() + ", please try again!");
        }

    });

};

/**
 * Defining function to fetch word full detail
 */
const fetchWordFullDefinition = (word, parentCallback) => {
    async.parallel({
        ex: function(callback) {
            fetchWordExamples(word, function(examples) {
                callback(null, examples);
            });
        },
        def: function(callback) {
            fetchWordDefinition(word, function(definition) {
                callback(null, definition);
            });
        },
        syn: function(callback) {
            fetchWordSynonyms(word, function(synonyms) {
                callback(null, synonyms);
            });
        },
        ant: function(callback) {
            fetchWordAntonyms(word, function(antonyms) {
                callback(null, antonyms);
            });
        }
    }, function(error, result) {
        parentCallback(result);
    });
};


/**
 * Function to featch the word of the day
 */

const fetchWordOfTheDay = (date) => {
    let URI = "http://api.wordnik.com:80/v4/words.json/wordOfTheDay?date=" + date + "&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    //console.log("URL is :- " + URI);
    request.get({
        "encoding": "utf-8",
        "method": "GET",
        "uri": URI,
        "followRedirect": false
    }, function(err, res, body) {
        try {
            let json = JSON.parse(body);
            console.log(chalk.cyan("Word of the day is %s"), json.word.toUpperCase());
        } catch (error) {
            console.log("Unable to fitch the word of the day at %s, please try again!", date.toLowerCase());
        }
    });
};

/**
 * Play the game
 */
const playGame = () => {
    let URI = "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    //console.log("URL is :- " + URI);
    request.get({
        "encoding": "utf-8",
        "method": "GET",
        "uri": URI,
        "followRedirect": false
    }, function(err, res, body) {
        try {
            let word = JSON.parse(body).word;

            fetchWordFullDefinition(word, function(result) {
                let count = 1;
                console.log(chalk.cyanBright("The word definition is - %s"), result.def.split('\n')[0]);
                console.log(chalk.yellowBright("Guess the word \n"));
                var stdin = process.openStdin();
                var arraySyn = result.syn.toLowerCase().trim().split('\n');
                //console.log(JSON.stringify(arraySyn));
                stdin.addListener('data', function(data) {
                    switch (count) {
                        case 1:
                            if ((word.toLowerCase().trim() === data.toString().toLowerCase().trim()) ||
                                arraySyn.includes(data.toString().toLowerCase().trim())) {
                                console.log(chalk.magentaBright("CONGRTS YOU WON !!! "));
                                stdin.end();
                            } else {
                                console.log(chalk.red("You are wrong sorry, use one the option to go further :-"));
                                console.log("1 - try");
                                console.log("2 - hint");
                                console.log("3 - quit\n");
                                count++;
                            }
                            break;
                        case 2:
                            if (data.toString().toLowerCase().trim() == "try") {
                                console.log("Please enter the word again !\n");
                                count--;
                            } else if (data.toString().toLowerCase().trim() == "hint") {
                                var defString = result.def;
                                var defArray = defString.split('\n');
                                if (defArray.length > 0) {
                                    var randomDefString = defArray[defArray.length - 1];
                                    console.log("Hint is - %s", randomDefString);
                                    console.log("Please enter the word again !\n");
                                } else {
                                    console.log("No hint is available");
                                    console.log("Please enter the word again !\n");
                                }
                                count--;
                            } else if (data.toString().toLowerCase().trim() == "quit") {
                                console.log("The word is - %s", word.toUpperCase());
                                console.log("DETAIL - ");
                                var ex = result.ex;
                                var def = result.def;
                                var syn = result.syn;
                                var ant = result.ant;
                                var value = "\nDefinition - \n" + def + "\n****\n" + "\nSynonyms - \n" + syn + "\n****\n" +
                                    "\nAntonyms - \n" + ant + "\n****\n" + "\nExamples - \n" + ex + "\n****\n";
                                console.log(value);
                                stdin.end();
                                count--;
                            } else {
                                console.log("Please select from above available options\n");
                            }
                            break;
                        default:
                            break;
                    }

                });
            });

        } catch (error) {
            console.log("Unable to play the game !");
        }
    });
};

/**
 * Function for help
 */
const fetchCommandHelp = () => {
    let fs = require('fs');
    try {
        var readStream = fs.createReadStream(__dirname + '/commandhelp.txt');
        readStream.pipe(process.stdin);
        readStream.on('error', function(error) {
            fs.readFile(__dirname + '/commandhelp.txt', (err, data) => {
                console.log(data);
            });
        });
    } catch (error) {
        fs.readFile(__dirname + '/commandhelp.txt', (err, data) => {
            console.log(data);
        });
    }

};

/**
 * Function to provide version
 */
const fetchCommandVersion = () => {
    console.log(chalk.blue("\n1.0.1\n"));
}

/**
 * Exporting the fitching function
 */
module.exports = { fetchWordDefinition, fetchWordSynonyms, fetchWordAntonyms, fetchWordExamples, fetchWordFullDefinition, fetchWordOfTheDay, playGame, fetchCommandHelp, fetchCommandVersion };