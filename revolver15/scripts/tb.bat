echo OFF
set n= %1 
for /l %%a in (1, 1, %n%) do (
echo "=== linha %%a"
)