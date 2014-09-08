#!/usr/bin/bash

set -e

do_help=0;
do_version=0;
do_scan=0;

function analyze_swf() {
    swf=$1;
    echo "analyzing $swf";
    workdir=$(mktemp -d); 
    localfile="${workdir}/local.swf";
    ua='Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2143.0 Safari/537.36';
    wget --no-check-certificate --user-agent "'$ua'" $swf -O $localfile 
    if [ -e $localfile ]; then
        java -Djava.net.preferIPv4Stack=true -Xmx1024m -jar ./bin/ffdec.jar -export script $workdir $localfile
        grep -n -r "ExternalInterface.call" $workdir;
        grep -n -r "LoaderInfo" $workdir;
    else
        echo "failed.";
        return
    fi 
}

function scan_swfs(){
    url=$1
    echo "scan $url";
    if [[ $url == *.swf ]];then
        echo 'swf specified';
        files="$url";
    else
        echo 'get file with phantomjs';
        files=$(phantomjs getswflist.js $url 2> /dev/null);
    fi 
    echo "files " $files
    for f in $files; do 
        analyze_swf $f;
    done
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
    "u" ) scan_swfs "$OPTARG"; exit;;
  esac
done

