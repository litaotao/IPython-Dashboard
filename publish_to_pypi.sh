#!/bin/bash

echo $*



echo "Translate markdown to rst"

pandoc --from=markdown --to=rst --output=README.rst README.md
mv README.md /mnt

echo "Register package info on pypi"

python setup.py register


echo "Upload package to pypi"

if [ $1 = "upload" ]
then
  echo "upload package to pypi"
  python setup.py sdist upload
fi

echo "Recover rst to md"

mv /mnt/README.md .
rm README.rst
