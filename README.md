jsdoc3Template
==============

[Screenshots](https://github.com/danyg/jsdoc3Template/wiki#wiki-screenshots)

A custom Customizable JSDOC3 template

Authors
- Michael Mathews  | first algorithm & templates
- lechecacharro		| augments algorithm & templates
- danyg				| change algorithm more OOP

Template based on Fabien Potencier's Sami: an API documentation generator (<https://github.com/fabpot/Sami>)
Uses SearchDoc Copyright (c) 2009 Vladimir Kolesnikov

Features
--------

- Made with Classes and Singletons (Alpha)
- Relatively easy way to add custom tags (Alpha)
- Searcher for methods class namespaces etc.. (Beta)
- Tree view of namespaces (Beta)
- @listen Tag to use with @events and @fires, in the event documentation you see the function or method that trigger or listen the event 

Usage
-----

This is a bash script to load this template. *Be careful the sources 
placed in INPUT_DIR they will be destroyed* you must designate a 
ORIGNAL_SOURCE path from copy your incremental code, 

  *NOTE:* the ORIGINAL_SOURCE must be your SVN or GIT working copy the .svn and .git folders are excludes

**LINUX**

    #!/bin/bash
  	TEMPLATE='myCustom'     # Template directory real JSDOC_DIR/templates/$TEMPLATE
  	OUTPUT_DIR='proyects/PROJECTNAME/docs/'       # HTML output dir, you must create before launch this. JSDOC_DIR/$OUTPUT_DIR
    INPUT_DIR='proyects/PROJECTNAME/src/'         # JS sources. You must put a package.json in directory PROJECTNAME 
    ORIGINAL_SOURCE='/home/YOURUSER/sources/PROJECTNAME/' # Be careful the sources placed in INPUT_DIR they will be destroyed

	function timer() # Only a Time elapsed calculate function 
	{
		if [[ $# -eq 0 ]]; then
			echo $(date '+%s')
		else
			local  stime=$1
			etime=$(date '+%s')

			if [[ -z "$stime" ]]; then stime=$etime; fi

			dt=$((etime - stime))
			ds=$((dt % 60))
			dm=$(((dt / 60) % 60))
			dh=$((dt / 3600))
			printf '%d:%02d:%02d' $dh $dm $ds
		fi
	}
	t=$(timer)

	echo -l 'Erasing old documentation'
	rm -r .$OUTPUT_DIR*
	echo '         Done!'

	echo 'Erasing Old Sources'
	rm -r .$INPUT_DIR*
	echo '         Done!'
	echo 'Coping new Sources'
	cp -rf $ORIGINAL_SOURCE* ./$INPUT_DIR
	echo 'Cleaning .svn and .git folders'
	rm -rf `find ./$INPUT_DIR -type d -name .svn`
	rm -rf `find ./$INPUT_DIR -type d -name .git`
	echo '         Done!'


	echo -l 'JSDOC!'
	./jsdoc -t templates/$TEMPLATE -d .$OUTPUT_DIR -r .$INPUT_DIR

	echo '         Done!'
	echo -l ''
	echo -l 'Time Elapsed: ' $(timer $t)

**WINDOWS / MS-DOS**

	@echo off

	REM jsdoc3\templates\%TEMPLATE%
	SET TEMPLATE=myCustom

	REM jsdoc3\doc\%OUTPUT_DIR%
	SET OUTPUT_DIR=proyects\PROJECTNAME\docs\

	REM jsdoc3\src\%INPUT_DIR%
	SET INPUT_DIR=proyects\PROJECTNAME\src\

	REM Working Copy, it's not be altered
	SET ORIGINAL_SOURCE=D:\Projects\PROJECTNAME\js\

	echo Erasing old documentation

	IF EXIST ".\doc\%OUTPUT_DIR%" ( 
		del /F/S/Q ".\doc\%OUTPUT_DIR%"
	) ELSE ( 
		echo "Making doc\%OUTPUT_DIR% directory"
		md ".\doc\%OUTPUT_DIR%"

	)
	echo          Done!

	echo Erasing Old Sources
	IF EXIST ".\src\%INPUT_DIR%" ( 
		echo "Eliminando Sources Viejos"
		del /F/S/Q ".\src\%INPUT_DIR%"
	) ELSE ( 
		echo "Making src\%INPUT_DIR% directory"
		md ".\src\%INPUT_DIR%"
	)
	echo          Done!

	echo Coping new Sources
	xcopy /E /Y /C /I /Q /H /R  "%ORIGINAL_SOURCE%*" ".\src\%INPUT_DIR%"

	echo Cleaning .svn and .git folders
	PUSHD .\
	cd ".\src\%INPUT_DIR%"
	for /d /r . %%d in (.svn) do @if exist "%%d" rd /s/q "%%d"
	for /d /r . %%d in (.git) do @if exist "%%d" rd /s/q "%%d"
	POPD

	echo          Done!

	echo JSDOC!
	.\jsdoc -t templates/%TEMPLATE% -d ./doc/%OUTPUT_DIR% -r ./src/%INPUT_DIR%
	echo          Done!

RoadMap (To do)
--------------
https://github.com/danyg/jsdoc3Template/wiki/To-Do
- Document the documenting code ;P
- Graph of inheritance
- More efficient template system (actually undescore)
- Custom tags in classes
- Probably use of MVC