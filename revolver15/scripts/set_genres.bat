echo OFF
echo "number of categories are %1"
C:\VOD\vod-browser\sed\sed -i "/^revolver.folder.count=/s/.*/revolver.folder.count=%1/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
shift
echo "New Categories are %1 AND %2 "

C:\VOD\vod-browser\sed\sed -i "/^udb.folder0.name=/s/.*/udb.folder0.name=%1/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
C:\VOD\vod-browser\sed\sed -i "/^udb.folder0.menu.id=/s/.*/udb.folder0.menu.id=%2/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
shift
shift

C:\VOD\vod-browser\sed\sed -i "/^udb.folder1.name=/s/.*/udb.folder1.name=%1/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
C:\VOD\vod-browser\sed\sed -i "/^udb.folder1.menu.id=/s/.*/udb.folder1.menu.id=%2/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
shift
shift

C:\VOD\vod-browser\sed\sed -i "/^udb.folder2.name=/s/.*/udb.folder2.name=%1/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
C:\VOD\vod-browser\sed\sed -i "/^udb.folder2.menu.id=/s/.*/udb.folder2.menu.id=%2/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
shift
shift

C:\VOD\vod-browser\sed\sed -i "/^udb.folder3.name=/s/.*/udb.folder3.name=%1/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
C:\VOD\vod-browser\sed\sed -i "/^udb.folder3.menu.id=/s/.*/udb.folder3.menu.id=%2/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
shift
shift

C:\VOD\vod-browser\sed\sed -i "/^udb.folder4.name=/s/.*/udb.folder4.name=%1/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
C:\VOD\vod-browser\sed\sed -i "/^udb.folder4.menu.id=/s/.*/udb.folder4.menu.id=%2/g" C:\vod-revolver-distribution\revolver\config\vod-revolver.properties
:end






