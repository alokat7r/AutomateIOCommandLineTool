#!/usr/bin/env node

const chalk = require('chalk');
const { fetchWordDefinition, fetchWordSynonyms, fetchWordAntonyms, fetchWordExamples, fetchWordFullDefinition, fetchWordOfTheDay, playGame, fetchCommandHelp, fetchCommandVersion } = require('./logic');


switch (process.argv.length) {
    case 2:
        //Word of the day 
        var date = new Date();
        var dateFormat = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        fetchWordOfTheDay(dateFormat);
        break;
    case 3:
        if (process.argv[2] === 'play') {
            playGame();
        } else if (process.argv[2] === '--help' || process.argv[2] === '-h') {
            fetchCommandHelp();
        } else if (process.argv[2] === '--version' || process.argv[2] === '-v') {
            fetchCommandVersion();
        } else {
            fetchWordFullDefinition(process.argv[2], function(result) {
                var ex = result.ex;
                var def = result.def;
                var syn = result.syn;
                var ant = result.ant;
                var value = "\nDefinition - \n" + def + "\n****\n" + "\nSynonyms - \n" + syn + "\n****\n" +
                    "\nAntonyms - \n" + ant + "\n****\n" + "\nExamples - \n" + ex + "\n****\n";
                console.log(chalk.blueBright(value));
            });
        }
        break;
    case 4:
        if (process.argv[2] === 'def') {
            var word = process.argv[3];
            fetchWordDefinition(word, function(definition) {
                console.log(chalk.magenta(definition));
            });
        } else if (process.argv[2] === 'ex') {
            var word = process.argv[3];
            fetchWordExamples(word, function(examples) {
                console.log(chalk.cyanBright(examples));
            });
        } else if (process.argv[2] === 'syn') {
            var word = process.argv[3];
            fetchWordSynonyms(word, function(synonyms) {
                console.log(chalk.yellowBright(synonyms));
            });
        } else if (process.argv[2] === 'ant') {
            var word = process.argv[3];
            fetchWordAntonyms(word, function(antonyms) {
                console.log(chalk.gray(antonyms));
            });
        } else if (process.argv[2] === 'dict') {
            var word = process.argv[3];
            fetchWordFullDefinition(word, function(result) {
                var ex = result.ex;
                var def = result.def;
                var syn = result.syn;
                var ant = result.ant;
                var value = "\nDefinition - \n" + def + "\n****\n" + "\nSynonyms - \n" + syn + "\n****\n" +
                    "\nAntonyms - \n" + ant + "\n****\n" + "\nExamples - \n" + ex + "\n****\n";
                console.log(chalk.blueBright(value));
            });
        } else {
            console.log("Please enter the right command.");
        }
        break;
    default:
        break;
}