const octokit = require('@octokit/rest')();
var newTagName;

// authenticate through GitHub Token w/ Octokit
octokit.authenticate({
       type: 'token',
       token: process.env.GH_TOKEN
   })

exports.handler = (event, context, callback) => {
    console.log('Received event:', event);


    octokit.repos.getLatestRelease({
        owner: process.env.GH_LOGIN,
        repo: process.env.GH_REPO
    }).then(result => {
        var tagName = parseInt(result.data.tag_name);
        newTagName = tagName + 1.0;
        newTagName = newTagName.toString() + ".0";


        octokit.repos.createRelease({
            owner: process.env.GH_LOGIN,
            repo:process.env.GH_REPO,
            tag_name: newTagName
        }, (error, result) => {
            if (error) throw new error;
            if (result) console.log("Created Deployment: " + JSON.string(result));
        });
    })

    octokit.repos.createDeployment({
        owner: process.env.GH_LOGIN,
        repo: process.env.GH_REPO,
        ref: "master",
        description: "Deploying " + newTagName + " version"
    }, (error, result) => {
        if (error) throw new error;
        if (result) console.log("Created Deployment: " + JSON.string(result));
    })
} 
