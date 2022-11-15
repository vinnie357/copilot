#!/bin/bash
function gitleaks {
docker run -v $(pwd):/code zricethezav/gitleaks:latest detect --source="/code" -v
}
