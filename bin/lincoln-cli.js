#!/usr/bin/env node
const program = require('commander')
const path = require('path')

const LincolnVault = require('@davidahouse/lincoln-api')

program
    .version('0.1.0')
    .option('-v, --vault <required>', 'Vault to use')
    .option('-l, --list <required>', 'Can be either vaults, contents')
    .option('-c, --container <required>', 'The name of the container')
    .option('-i, --import <required>', 'Import a file')
    .option('-d, --delete', 'Delete the contents of a container')
    .description('lincoln command line')
    .parse(process.argv)

console.log('----- Lincoln CLI -----')
console.log('      version 0.1.0')

// List the vaults found in the lincoln config
if (program.list && program.list == 'vaults') {
  console.log('Searching for vaults...')
  const vault = new LincolnVault('')
  vault.allVaults(function(err, items) {
    for (let i=0; i<items.length; i++) {
      console.log(path.basename(items[i], '.vaultConfig'))
    }
  })
}

// List the contents from a container
if (program.list && program.list == 'contents') {
  if (!program.vault || !program.container) {
    console.log('Vault and Container parameters are required to list contents')
    process.exit(1)
  }

  const vault = new LincolnVault(program.vault)
  vault.contents(program.container, function(err, items) {
    for (let i=0; i<items.length; i++) {
      console.log(items[i])
    }
  })
}

// Import
if (program.import) {
  if (!program.vault || !program.container) {
    console.log('Vault and Container parameters are required to import contents')
    process.exit(1)
  }

  const vault = new LincolnVault(program.vault)
  vault.importFile(program.container, program.import)
  console.log(program.import + ' imported')
}
