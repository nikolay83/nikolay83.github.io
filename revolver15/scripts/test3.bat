@ECHO OFF
echo the arguments: %*

Echo Current dir: "%CD%"

echo "This goes to stdout ##sdufygsdhv6546"
echo "teste ============="
echo "This is stdout line 2"
echo PROGRESSREPORT: Getting Metadata
echo "This goes to stderr" 1>&2
echo the arguments: %*

Echo Current dir: "%CD%"
ping google.com
echo PROGRESSREPORT: Generating videos
echo "This goes to stdout"
echo "This is stdout line 2"
echo "This goes to stderr" 1>&2
echo the arguments: %*

Echo Current dir: "%CD%"
ping google.pt
echo "This goes to stdout"
echo "This is stdout line 2"
echo "This goes to stderr" 1>&2
echo the arguments: %*
echo PROGRESSREPORT: Calling Manzanita muxer

Echo Current dir: "%CD%"
ping yahoo.com
echo "This goes to stdout"
echo "This is stdout line 2"
echo "This goes to stderr" 1>&2
echo PROGRESSREPORT: Building EBIF
echo the arguments: %*
ping sapo.pt

Echo Current dir: "%CD%"
cmd /c "%~dp0"/testchild.bat
echo "This goes to stdout"
echo "This is stdout line 2"
echo "This goes to stderr" 1>&2
echo PROGRESSREPORT: Exporting output to target location
ping esa.eu
echo "This goes to stdout"
echo "This is stdout line 2"
echo "This goes to stderr" 1>&2
echo PROGRESSEND: Process end
goto :end
:end
