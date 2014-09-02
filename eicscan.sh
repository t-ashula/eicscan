#!/usr/bin/bash

set -e

do_help=0;
do_version=0;
do_scan=0;

function scan_swf(){
    url=$1
    echo "scan $url";
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

