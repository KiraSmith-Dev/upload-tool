# upload-tool

Simple but powerful self-hosted file sharing tool that I made for myself, but if someone else finds it useful that's cool

## Features
- Hosts a small express server to serve files from your own computer/network
- Command line tool compresses and moves files or directories to the public folder of the server
- Coppies the URL to your clipboard
- Glob pattern matching and blacklisting of files in directories

---

## Installation
Requirements:
- An [up to date vesion of node](https://nodejs.org/en/download/) (16.14.2 tested)
- The ability to port forward

Steps:
- Clone this repo to wherever you want
- Change the port in config.js if desired
- Make sure that the [port is forwarded](https://www.google.com/search?q=how+to+port+forward) (TCP) and your firewall allows traffic through
- Run `node index.js` (node targeting the index.js file) from anywhere to run the server
- Run `node makeURL.js` (same as above but with makeURL.js) from anywhere (with arguments) to upload

Optionally you can place a .bat script (or on non-windows systems, an equivalent script) somewhere on your PATH
Ex: I have a file named `upload.bat` as a shortcut which is as follows:
```bat
@echo off
node E:\Projects\NodeJS\upload-tool\makeURL.js %*
```
I have it in a folder that's in the PATH enviornment variable, so that I can use it as: `upload file.txt`\
[See here](https://gist.github.com/nex3/c395b2f8fd4b02068be37c961301caa7) on how to add a folder to PATH

---

You may also want to start the server on startup of your system.\
There are a couple options:
- Put a .bat script similar to the one before in your startup folder
- Use [pm2](https://github.com/Unitech/pm2) to manage it, google will help here
- Look up other solutions to start processes on startup of your system

## Usage

`makeURL <path-to-file-or-folder> [options]`

### Options:
- `-r`, `--rename`: Set output filename
- `-g`, `--glob <pattern>`: Include files matching this pattern (only avaliable when passing a directory)
- `-b`, `--blacklist <pattern>`: Exclude files matching this pattern (only avaliable when passing a directory)
- `-l`, `--level <level>`: Compression level. 0-9, 0 = none, 1 = low, 9 = high. Defaults to 9
- `-z`, `--zip`: Compress file to archive (directories will always compress reguardless of this option)

[See here](https://github.com/motemen/minimatch-cheat-sheet) on how to use the glob patterns

### Example usage:
Upload a single file:\
`makeURL file.txt`

Upload a file and compress to zip:\
`makeURL file.txt -z` or `makeURL file.txt --zip`

Upload a file, renamed to myFile.txt\
`makeURL file.txt -r myFiles`

Upload a directory\
`makeURL path/to/directory`

Upload a directory, renamed to myFiles.zip\
`makeURL path/to/directory -r myFiles`

Upload a directory, but with less (faster) compression\
`makeURL path/to/directory -l 3`

Upload certain files from a directory that match the pattern\
(ex: every .png file in every subdirectory)\
`makeURL path/to/directory -g **/*.png`

Upload all files from a directory except those that match the pattern\
(ex: every file except .dll files from every subdirectory)\
`makeURL path/to/directory -b **/*.dll`

Upload files from a directory that match the glob pattern except those that match the blacklsit pattern\
(ex: every .png file except .png files that end in "noupload.png")\
`makeURL path/to/directory -p **/*.png -b **/*noupload.png`
