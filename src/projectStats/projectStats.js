const fs = require('fs')

const countFileLines = function (filePath) {
	return fs.readFileSync(filePath, 'utf-8').split('\n').length
}

const projectStats = (project) => {
	const badFiles = []
	const countFiles = (folder) => {
		const subFolders = folder.children.filter(({ type }) => type === 'folder')
		const files = folder.children.filter(({ type }) => type === 'file')

		files.forEach((file) => {
			const isBadFile = smellFile(file)

			if (isBadFile) {
				badFiles.push(file)
			}
		})

		let subFoldersTotal = 0

		subFolders.forEach((subFolder) => {
			subFoldersTotal += countFiles(subFolder)
		})

		const folderTotal = folder.children.filter(({ type }) => type === 'file')
			.length

		folder.count = subFoldersTotal + folderTotal

		return folder.count
	}
	const nFiles = countFiles(project)

	console.log('bad files :')
	badFiles.forEach(({ path, smell }) => {
		console.log(`  ${path} ${smell.lines} lines`)
	})

	return {
		nFiles
	}
}

module.exports = projectStats

const smellFile = (file) => {
	if (
		['png', 'jpg'].includes(file.path.split('.').reverse()[0].toLowerCase()) ||
		file.path.includes('package-lock.json')
	) {
		return false
	}

	lines = countFileLines(file.path)

	file.smell = {
		lines
	}

	const isBadFile = lines > 300

	return isBadFile
}
