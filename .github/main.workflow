workflow "Test" {
  resolves = ["Setup Node.js for use with actions"]
  on = "push"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm run test"
}

action "Setup Node.js for use with actions" {
  uses = "actions/setup-node@7af5963081f4115489390c8e8e31da346136cb37"
  needs = ["GitHub Action for npm"]
}
