'use strict';
import * as moment from 'moment';

interface GmgArgv {
    user: string;
    repo: string;
    date: string;
    start: number;
    count: number;
    period: number;
    format: string;
    dryRun: boolean;
    verbose: boolean;
    githubToken: string;
}

const DEFAULT_START = 1;
const DEFAULT_COUNT = 1;
const DEFAULT_PERIOD = 7;
const DEFAULT_TEMPLATE = 'sprint-<%= index %>: <%= date %> (w<%= w %>)';

const DEFAULT_DRY_RUN = false;
const DEFAULT_VERBOSE = false;
let argv: GmgArgv = require('yargs')
        .usage('Usage: $0 -u [user] -r [repo] -d [date] -s [start] -c [count] -p [period] -f [format]')
        .demand(['u', 'r', 'd', 's', 'c'])
        .alias('u', 'user')
        .alias('r', 'repo')
        .alias('d', 'date')
        .alias('s', 'start')
        .alias('c', 'count')
        .alias('p', 'period')
        .alias('f', 'format')
        .alias('y', 'dry-run')
        .alias('v', 'verbose')
        .alias('g', 'github-token')
        .string('d')
        .default('d', moment().format('YYYY-MM-DD'))
        .default('s', DEFAULT_START)
        .default('c', DEFAULT_COUNT)
        .default('p', DEFAULT_PERIOD)
        .default('f', DEFAULT_TEMPLATE)
        .default('y', DEFAULT_DRY_RUN)
        .default('v', DEFAULT_VERBOSE)
        .describe('u', 'User or organization name')
        .describe('r', 'Repository to create milestone')
        .describe('d', 'Date from which the milestone starts (yyyy-MM-dd)')
        .describe('s', `Start index of the sprint (default is ${DEFAULT_START})`)
        .describe('c', `Count of sprints that will be generated (default is ${DEFAULT_COUNT})`)
        .describe('p', `Sprint's period (default is ${DEFAULT_PERIOD})`)
        .describe('f', `Sprint's title template (default is ${DEFAULT_TEMPLATE})`)
        .describe('y', `Dry-run mode, where no milestone is actually posted to github (default is ${DEFAULT_DRY_RUN})`)
        .describe('v', `Debug mode with detailed log information (default is ${DEFAULT_VERBOSE})`)
        .describe('g', `Github token (you can use env variable GMG_GITHUB_TOKEN instead)`)
        .epilog('copyright 2015')
        .argv
    ;

export default argv;
