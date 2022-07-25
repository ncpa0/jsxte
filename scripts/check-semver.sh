#!/usr/bin/env bash
# https://gist.github.com/rverst/1f0b97da3cbeb7d93f4986df6e8e5695

function chsv_check_version() {
  if [[ $1 =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-((0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$ ]]; then
    echo true
  else
    echo false
  fi
}

function chsv_check_version_ex() {
  if [[ $1 =~ ^v.+$ ]]; then
    chsv_check_version "${1:1}"
  else
    chsv_check_version "${1}"
  fi
}

function chsv_print_usage() {
  echo
  echo "Usage: check_semver.sh [OPTIONS] VERSION"
  echo
  echo "A script to check a version on compliance to Semantic Versioning 2.0.0. (https://semver.org/)"
  echo
  echo "Options:"
  echo "  -v        Verbose output, prints errors and echos the raw version on success"
  echo "  -t        Test if provided string is a valid semver"
  echo "  -h        Print usage"
  echo
  echo
}

function chsv_main() {
  test=0
  verbose=0
  version="${@: -1}"

  while getopts ":vt" opt; do
    case $opt in
      t) test=1
      ;;
      v) verbose=1
      ;;
      \?) echo "Invalid option -$OPTARG" >&2; echo; chsv_print_usage; exit 1
      ;;
    esac
  done

  issemver=$(chsv_check_version_ex "$version")

  if [[ $test -eq 1 ]]; then
    if $issemver; then
      echo 1
    else
      echo 0
    fi
    exit 0
  fi


  if [[ ! $issemver ]]; then
    if [[ $verbose -eq 1 ]]; then
      echo "'$version' is not a valid semantic version"
    fi
    exit 2
  fi

  if [[ $verbose -eq 1 ]]; then
    echo "$version"
  fi
  exit 0
}

chsv_main "$@"