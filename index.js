const octokit = require('@octokit/rest')

// authenticate through GitHub Token w/ Octokit
octokit.authenticate({
  type: 'token',
  token: process.env.GH_TOKEN
})

exports.handler = (event, context, callback) => {
  console.log(`Received event: ${event}`)
  const owner = process.env.GH_LOGIN
  const repo = process.env.GH_REPO

  octokit.repos.getLatestRelease({
    owner,
    repo
  }).then(result => {
    let tag_name = (parseInt(result.data.tag_name) + 1.0).toString() + '.0'

    octokit.repos.createRelease({
      owner,
      repo,
      tag_name
    }, (error, result) => {
      if (error) throw new Error()
      if (result) console.log(`Created Deployment: ${JSON.stringify(result)}`)
    })
  })

  octokit.repos.createDeployment({
    owner,
    repo,
    ref: 'master',
    description: `Deploying ${newTagName} version`
  }, (error, result) => {
    if (error) throw new Error()
    if (result) console.log(`Created Deployment: ${JSON.stringify(result)}`)
  })
}
