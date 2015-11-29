For Reviewers
---------------------------------------------
- All of the new files are container in app/Forum subdirectory
- Compiled source is included. You can use any simple http server to serve static files from app folder in order
  to run the prototype
- Ignore any non-forum js errors (due to runing without backend server)
- Mock login functionality implemented using ngMockE2E. To login use the following (username/pass):
john.doe@mail.com/sample123 (non-admin)
jane.doe@mail.com/sample123 (admin)
- Forum modifications are persisted in memory - refreshing resets everything
- Mock data is in Forum/data/mockForum.js and loaded using mock repository service
- Use nickname 'rioandrew' to fail the nickname check

For Assemblers
---------------------------------------------
- Add new files from app/Forum folder to the source code repository. Make sure to update all js/css/img paths
if the directory structure changes.
- update gruntfile with paths to new files
- Use diff tool on app.js and index.html to:
-- Add module dependencies and nickname popup functionality form app.js
-- Add css links and forum-nickname-registration.html template to index.html 
