#!/usr/bin/env node

const fs = require('fs')
const projectStats = require('./projectStats/projectStats')
const readProjectStructure = require('./readProjectStructure/readProjectStructure')

const script = () => {
	const project = readProjectStructure()
	projectStats(project)

	console.log(`${project.count} fichiers`)
}

script()
