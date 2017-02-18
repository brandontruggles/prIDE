# prIDE

A completely free (and open source) online IDE with real-time code sharing between peers, a built in chat system, GitHub integration, and a built-in file system for creating and managing projects.

While online IDEs similar to this currently exist on the market, many of the better ones charge money for their services. What makes our online IDE unique is the fact that it uses a custom-built Node.js server package to provide all of our services free of charge. Simply have one person download the server package with npm, run it, and you and your peers can easily connect to it and begin collaborating in minutes!  

Why is it called prIDE? While brainstorming names for the project, we decided that the name prIDE would not only be catchy, but would also allow us to shed light on a cause that we all believe in, LGBTQ equality. We hope that while using prIDE, you will take the time to read up on, and possibly donate to, the activist organization GLAAD (linked on our front-end), which works closely with the community and media to educate the public on LGBTQ rights and issues.

## Core Dependencies

- Node.js (with npm)
- Bower

## Installation Instructions (For Host Server)

1. Install the core dependencies onto your server.

2. Download and extract this repository, or use the command `git clone https://github.com/brandonrninefive/prIDE.git` to save the project files on your server.

3. Navigate to the `prIDE/Server` directory and type the command `npm install` to install all of our Node.js dependencies.

## Running the Server

To run the server, you must navigate to the root project directory (which should be called prIDE), and type the command `node Server/index.js`.

## Running the Front-End

We recommend using an HTTP server application such as Apache Webserver to host the front-end of the project on a dedicated machine for your team. This dedicated machine can be the same as the host server running the Node.js server, as long as the two server applications use different port numbers. We are currently in the process of switching over from using bower to using browserify and watchify in order to host the front-end through Node.js as well.

Before hosting the front-end, there are a few dependencies that must be installed through bower. To do this, navigate to the root project directory and type the command `bower install`.

## Connecting to the Server

To connect to the server as a  user, simply connect to an instance of our front-end from your browser and type in your desired nickname, and the IP/port of the host server. 

## Feature To-Do List

- [ ] Re-design the front-end using React.js.
- [ ] Implement read-only links for inviting others to view code changes in real-time.
- [ ] Allow users to compile and run different languages.
- [ ] Create a dedicated mobile client using React Native.
- [ ] Create a dedicated desktop client using Electron.
- [ ] Add functionality to install external libraries on the host server.
