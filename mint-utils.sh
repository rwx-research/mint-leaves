#!/usr/bin/env bash
# mint-utils version 1.0.0

detected_os=""
detected_os_version=""
detected_os_codename=""
detected_arch=""

function mint__detect_os_arch {
  if [ -f /etc/os-release ]; then
    . /etc/os-release

    detected_os="$ID"
    detected_os_version="$VERSION_ID"
    detected_os_codename="$VERSION_CODENAME"
  fi

  detected_arch=$(uname -m)
}

function mint_os_name {
  if [ -z "$detected_os" ]; then
    mint__detect_os_arch
  fi
  echo "$detected_os"
}

function mint_os_version {
  if [ -z "$detected_os_version" ]; then
    mint__detect_os_arch
  fi
  echo "$detected_os_version"
}

function mint_os_codename {
  if [ -z "$detected_os_codename" ]; then
    mint__detect_os_arch
  fi
  echo "$detected_os_codename"
}

function mint_arch {
  if [ -z "$detected_arch" ]; then
    mint__detect_os_arch
  fi
  echo "$detected_arch"
}

function mint_arch_amd {
  local arch
  arch="$(mint_arch)"
  if [ "$arch" = "x86_64" ]; then
    echo "amd64"
  else
    echo "$arch"
  fi
}

function mint_os_version_gte {
  local compare_version="$1"
  printf '%s\n' "$compare_version" "$(mint_os_version)" | sort -Vsc >/dev/null 2>&1
}

function mint_os_version_lte {
  local compare_version="$1"
  printf '%s\n' "$compare_version" "$(mint_os_version)" | sort -Vsc -r >/dev/null 2>&1
}
