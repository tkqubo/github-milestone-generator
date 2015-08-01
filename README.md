# GitHub Milestone Generator

```
Usage: index.js -u [user] -r [repo] -d [date] -s [start] -c [count] -p [period
] -f [format]

Options:
  -u, --user          User or organization name                       [required]
  -r, --repo          Repository to create milestone                  [required]
  -d, --date          Date from which the milestone starts (yyyy-MM-dd)
                                     [string] [required] [default: "2015-08-01"]
  -s, --start         Start index of the sprint (default is 1)
                                                         [required] [default: 1]
  -c, --count         Count of sprints that will be generated (default is 1)
                                                         [required] [default: 1]
  -p, --period        Sprint's period (default is 7)                [default: 7]
  -f, --format        Sprint's title template (default is sprint-<%= index
                      %>: <%= date %> (w<%= w %>))
                       [default: "sprint-<%= index %>: <%= date %> (w<%= w %>)"]
  -y, --dry-run       Dry-run mode, where no milestone is actually posted to
                      github (default is false)                 [default: false]
  -v, --verbose       Debug mode with detailed log information (default is false
                      )                                         [default: false]
  -g, --github-token  Github token (you can use env variable GMG_GITHUB_TOKEN
                      instead)
```
