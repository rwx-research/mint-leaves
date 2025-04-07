#!/usr/bin/env bash
# mint-utils version 1.0.2

detected_os=""
detected_os_version=""
detected_os_codename=""
detected_arch=""
detected_package_manager=""

function mint__detect_os_arch {
  if [ -f /etc/os-release ]; then
    . /etc/os-release

    detected_os="$ID"
    detected_os_version="$VERSION_ID"
    detected_os_codename="$VERSION_CODENAME"

    case "$ID" in
      ubuntu|debian)
        detected_package_manager="apt"
        ;;
    esac
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

# Output the name and version of the operating system as expected by Mint's `base.os` field.
function mint_os_name_version {
  echo "$(mint_os_name) $(mint_os_version)"
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

function mint_os_package_manager {
  if [ -z "$detected_package_manager" ]; then
    mint__detect_os_arch
  fi
  echo "$detected_package_manager"
}

function mint_os_version_gte {
  local compare_version="$1"
  printf '%s\n' "$compare_version" "$(mint_os_version)" | sort -Vsc >/dev/null 2>&1
}

function mint_os_version_lte {
  local compare_version="$1"
  printf '%s\n' "$compare_version" "$(mint_os_version)" | sort -Vsc -r >/dev/null 2>&1
}

# Convert a string something usable as a Mint key.
#
# Replaces all non-alphanumeric characters with hyphens, compressing multiple hyphens into one.
function mint_keyify {
  echo -n "$*" | tr -c -s '[:alnum:]' '-'
}
