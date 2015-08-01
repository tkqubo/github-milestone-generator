'use strict';
import config from './config';
import * as moment from 'moment';
import * as rx from 'rx';
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import argv from './argv';
const GitHubApi: any = require('node-github');
const github: any = new GitHubApi({
    version: "3.0.0",
    debug: argv.verbose
});

github.authenticate({
    type: "oauth",
    token: argv.githubToken || process.env.GMG_GITHUB_TOKEN
});
let repoInfo = {
    user: argv.user,
    repo: argv.repo
};

github.issues.getAllMilestones(repoInfo, (error: any, milestones: any) => {
    if (!!error) {
        console.log('Failed to get milestones');
        console.error(error);
        return;
    }

    let createMilestone: (() => Promise<any>) =
        argv.dryRun ? Promise.resolve.bind(null, true) : Promise.promisify(github.issues.createMilestone);
    let template = _.template(argv.format);
    let startDate: moment.Moment = moment(argv.date);
    rx.Observable
        .range(argv.start, argv.count)
        .map((index) => { // Construct post body
            let m = startDate.add(argv.period * index - 1);
            var date = m.format('YYYY-MM-DD');
            let w = Math.ceil(m.date() / 7);

            let title = template({ index, date, w });
            let due_on = m.add(argv.period, 'd').toISOString();

            let body = {title, due_on};
            _.merge(body, repoInfo);

            return body;
        })
        .map((body: any) => { // Combine post body and the existence of duplicated milestone
            let exists = !_.where(milestones, { title: body.title }).length;
            if (argv.verbose) {
                console.log(`request construct: ${JSON.stringify({ body, exists }, null, 2)}`);
            }
            return { body, exists };
        })
        .filter((paramsWithExistence) => !paramsWithExistence.exists)
        .pluck('params')
        .flatMap(createMilestone)
        .subscribe((response) => {
            if (argv.verbose) {
                console.log(`Create result: ${response}`);
            }
        }
        , console.error
        , () => {
            if (argv.verbose) {
                console.log('Finished');
            }
        })
    ;
});

