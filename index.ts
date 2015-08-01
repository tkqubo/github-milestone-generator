'use strict';
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

github.issues.getAllMilestones(repoInfo, (error: any, milestones: any[]) => {
    if (!!error) {
        console.log('Failed to get milestones');
        console.error(error);
        return;
    }
    if (argv.verbose) {
        console.log('Milestones:');
        console.dir(milestones);
    }

    let template = _.template(argv.format);
    let startDate: moment.Moment = moment(argv.date);
    rx.Observable
        .range(argv.start, argv.count)
        .map((index) => { // Construct post body
            let m = startDate.add(argv.period * index);
            var date = startDate.format('YYYY-MM-DD');
            let w = Math.ceil(m.date() / 7);

            let title = template({ index, date, w });
            let due_on = m.add(argv.period - 1, 'd').toISOString();

            let body = {title, due_on};
            _.merge(body, repoInfo);

            return body;
        })
        .map((body: any) => { // Combine post body and the existence of duplicated milestone
            let exists = !!_.where(milestones, { title: body.title }).length;
            if (argv.verbose) {
                console.log(`request construct: ${JSON.stringify({ body, exists }, null, 2)}`);
            }
            return { body, exists };
        })
        .filter((paramsWithExistence) => !paramsWithExistence.exists)
        .pluck('body')
        .flatMap((body: any) => {
            if (argv.dryRun) {
                return Promise.resolve(true);
            }

            return new Promise((resolve: Function, reject: Function) => {
                github.issues.createMilestone(body, (response: any) => {
                   resolve(response);
                });
            });
        })
        .subscribe((response: any) => {
            if (argv.verbose) {
                console.log(`Create result: ${response}`);
            }
        }, (error: any) => {
            console.log('error');
            console.error(error);
        }, () => {
            if (argv.verbose) {
                console.log('Finished');
            }
        })
    ;
});

