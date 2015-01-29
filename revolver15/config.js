module.exports = {

  /**
   * Base path for all scripts.
   */
  
  BASE_PATH : "C:\\revolver\\vod-browser_current",
  //BASE_PATH : __dirname + '\\scripts',

  /**
   * If timeout is greater than 0, then it will kill the child process if it runs longer than timeout milliseconds.
   */
  TIMEOUT : 0,

  /**
   * The kill signal to be used for timeout situations. Please note, this must be a supported signal in the OS
   * http://msdn.microsoft.com/en-us/library/xdkz3x12.aspx
   */
  TIMEOUT_SIGNAL : 'SIGTERM',

  /**
   * Array of supported genres.
   */
  CATEGORIES : ["JustIn", "Action", "Comedy", "Romance", "Drama"]

}