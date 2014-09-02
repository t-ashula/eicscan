#!/usr/bin/bash

set -e

do_help=0;
do_version=0;
do_scan=0;

function scan_swf(){
    url=$1
    echo "scan $url";
    if [ $url == *.swf ];then
        echo 'swf specified';
        files=$url;
    else
        echo 'get file with phantomjs';
        files=$(phantomjs getswflist.js $url 2> /dev/null);
    fi 
    echo $files
}

function show_help(){
    echo "usage: eicscan -u URL";
}

function show_version(){
    echo "eicscan 0.1.0";
}

while getopts u:hv OPT; do
    case $OPT in
    "h" ) show_help;exit;;
    "v" ) show_version;exit;;
    "u" ) scan_swf "$OPTARG"; exit;;
  esac
done

