#!/usr/bin/env bash

set -eEuo pipefail

id=$RANDOM

# brew install httpie

http --check-status --pretty all --print hb \
  'http://localhost:3001/api/blogs' \
  title=title${id} \
  author=author${id} \
  url=url${id} \
  likes=${id} >> test.log
http --check-status --pretty all --print hb \
  'http://localhost:3001/api/blogs' >> test.log
