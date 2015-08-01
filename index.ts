'use strict';
import config from './config';
import * as moment from 'moment';
const GitHubApi: any = require('node-github');
const github: any = new GitHubApi({
    version: "3.0.0",
    debug: true
});
const argv = require('yargs')
        .usage('Usage: $0 -u [user] -r [repo] -d [date]')
        .demand(['u', 'r', 'd'])
        .alias('u', 'user')
        .alias('r', 'repo')
        .alias('d', 'date')
        .describe('u', 'User or organization name')
        .describe('r', 'Repository to create milestone')
        .describe('d', 'Date from which the milestone starts (yyyy-MM-dd)')
        .epilog('copyright 2015')
        .argv
    ;


let now = moment().toISOString();

github.authenticate({
    type: "oauth",
    token: config.githubToken
});

github.issues.getAllMilestones({
    user: argv.user,
    repo: argv.repo
}, (error: any, response: any) => {
    if (!!error) {
        console.error(error)
    }
    console.dir(response);
});

