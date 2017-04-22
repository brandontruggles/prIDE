# prIDE

A completely free (and open source) online IDE with real-time code sharing between peers, a built in chat system, GitHub integration, and a built-in file system for creating and managing projects.

While online IDEs similar to this currently exist on the market, many of the better ones charge money for their services. What makes our online IDE unique is the fact that it uses a custom-built Node.js server package to provide all of our services free of charge. Simply have one person download the server package with npm, run it, and you and your peers can easily connect to it and begin collaborating in minutes!  

Why is it called prIDE? While brainstorming names for the project, we decided that the name prIDE would not only be catchy, but would also allow us to shed light on a cause that we all believe in, which is LGBTQ equality. We hope that while using prIDE, you will take the time to read up on, and possibly donate to, the activist organization [GLAAD](http://www.glaad.org/ "GLAAD Website"), which works closely with the community and media to educate the public on LGBTQ rights and issues.

## Core Dependencies

- [Node.js](https://nodejs.org/ "Node.js Website") and [NPM](https://www.npmjs.com/ "NPM Website")
- The compilers/interpreters for any languages you wish to use (Java, Python, GCC, etc.)
- [Git](https://git-scm.com/ "Git Website") (Needed for Git integration)

## Installation Instructions

1. Install the core dependencies onto your server.

2. Download and extract this repository, or use the command `git clone https://github.com/brandonrninefive/prIDE.git` to save the project files on your server.

3. Navigate to the root `prIDE/` directory and type the command `npm install` to install all of our Node.js dependencies.

4. If you wish to contribute to our project, you must install gulp-cli with `npm install -g gulp-cli`.

## Running prIDE

The easiest way to run prIDE is to navigate to the root `prIDE/` directory and type the command `npm start`. This will automatically launch the Express server for the front-end, as well as the websocket server for the back-end. 

Each server can also be run independently, although this isn't recommended since there isn't much reason to do so. To run the front-end Express server independently, you can navigate to the `prIDE/Front-End` directory and type the command `node front-server.js`. To run the back-end websocket server independently, you can navigate to the `prIDE/Back-End` directory and type the command `node back-server.js`.

## Using prIDE

To connect to the server as a user, simply open an instance of the front-end from your browser and type in your desired nickname, and the IP/port of the host server. If you are the person hosting the server, the IP will be `0.0.0.0`. Outside users will need to connect to the public IP address of the server.

Upon connecting to a prIDE server through the front-end, you will be able to create a new project using the top navigation bar, or open an existing project on the server through the navigation pane on the left side of the screen. Once a project is open, you can then open a file within the project using the same navigation pane, or create a new file within the project using the top navigation bar. Once a file is opened, its contents will appear in the main code window for editing. Changes to any file will be saved on the server and pushed to all other users viewing that file in real-time.

On the host server, prIDE projects are simply represented as named directories found within the `prIDE/Workspace/` directory. The `prIDE/Workspace/` directory is automatically generated if it does not exist at the time that prIDE is started. The files within projects on a prIDE server are stored in the named directory corresponding to their project. Currently, the only way to delete a project or its files from prIDE is to have the server admin log onto the host server and delete the files manually.

## Configuring prIDE

When prIDE is started for the first time, two new config files will be generated within the root `prIDE/` directory named `front-server.conf` and `back-server.conf`. These two config files are read by prIDE during startup, and allow the server admin to modify different server settings such as the default ports for the front-end and back-end servers, as well as the maximum number of allowed clients on the back-end server, using simple JSON syntax. The default port for the front-end server is `80`, while the default port for the back-end server is `9000`.

## Currently Supported Languages

- Java
- C++
- C 
- Python

## Feature To-Do List

- [x] Re-design the front-end using React.js.
- [x] Add functionality to install external libraries on the host server.
- [x] Allow users to compile and run multiple languages.
- [ ] Add more settings so prIDE can be configured better (you should be able to compile/run any language if prIDE is pointed to the correct programs through some kind of config file, you should be able to push to any remote git repo, etc).
- [ ] Implement read-only links for inviting others to view code changes in real-time.
- [ ] Create a dedicated mobile client using React Native.
- [ ] Create a dedicated desktop client using Electron.
