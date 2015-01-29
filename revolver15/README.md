
Use a standard VM for the revolver application (standard directories and applications are assumed to be installed)

# Deployment

1) Pre-deployment tasks

   Remove 'pause' from C:\vod-revolver-distribution\revolver\bin\start.bat
   Install NodeJS - Installer is available at http://nodejs.org/

   (Optional) - set the configured genres in config.js

2) Install dependencies

    npm install
    npm install -g forever

3) Start/Stop Commands

    forever start app.js
    forever stop app.js

# Testing

    Open http://localhost:3000/ in your browser, click on "Start"

* Notes
- The Development VM is not able to connect to the client end points, this will NOT cause the scripts to fail, but
  the data will be incomplete(and may cause invalid packaging), it is assumed that connectivity is available for testing
- The wrapper script is a copy of the current build script with the following changes
    a) Removed all pause commands
    b) instead of calling genvideos-barker.bat which has hardcoded parameters, It calls muxBarkerWithBackground directly
       passing in the selected genre, and the previous and next genre in the configuration list
- Demo video is available at: http://www.screencast.com/t/5aAaqyiv