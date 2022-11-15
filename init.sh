#!/bin/bash
path="./scripts"
scripts=$(ls -p $path | grep -v / )
# menu
function menu {
  echo "==== scripts ===="
  for script in $scripts
  do
    echo "${script%.*}"
  done
}
# imports
for script in $scripts
do
    source $path/$script
    echo "adding: ${script%.*}"
done
echo "==== init done ===="
