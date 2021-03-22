const fs = require('fs')

const ignoreToRegex = (ignore) =>
	new RegExp(
		ignore
			.replace(/\*\*/g, 'DOUBLEASTERIX')
			.replace(/\*/g, 'SIMPLEASTERIX')
			.replace(/DOUBLEASTERIX/g, '.*')
			.replace(/SIMPLEASTERIX/g, '[^/]*')
	)

const getIgnored = () => {
	if (!fs.existsSync('.gitignore')) {
		console.log(`Can't find .gitignore file`)
		process.exit()
	}

	const paths = fs
		.readFileSync('.gitignore', 'utf-8')
		.replace(/\r/g, '')
		.split('\n')
		.filter((path) => !!path)
		.filter((path) => !path.match(/^[ \t]*#/))

	return [ignoreToRegex('.git'), ...paths.map((path) => ignoreToRegex(path))]
}

const ignoreFiles = getIgnored()

const fileMatchIgnore = (file, ignore) => {
	return !!ignore.test(file.path)
}

const ignoredFilesFilter = (file) => {
	for (let i = 0; i < ignoreFiles.length; i++) {
		if (fileMatchIgnore(file, ignoreFiles[i])) {
			return false
		}
	}
	return true
}
const getFolderContent = (folder) => {
	const content = fs
		.readdirSync(folder)
		.map((file) => {
			const path = `${folder}/${file}`

			const isDir = fs.lstatSync(`${folder}/${file}`).isDirectory()

			return {
				path: path + (isDir ? '/' : ''),
				type: isDir ? 'folder' : 'file'
			}
		})
		.filter(ignoredFilesFilter)
		.map((file) =>
			file.type === 'folder'
				? { ...file, children: getFolderContent(file.path) }
				: file
		)

	return content
}

const readProjectStructure = () => ({
	path: '.',
	children: getFolderContent('.'),
	type: 'folder'
})

module.exports = readProjectStructure
