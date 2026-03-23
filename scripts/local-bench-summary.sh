#!/usr/bin/env bash

export BENCH_JSON_OUTPUT=./bench-results.json

pnpm bench:compare

echo ""
echo "━━━ Summary ━━━"
node scripts/format-bench-cli.mjs

# Print tips for reducing variance
echo "━━━ Tips for more reliable results ━━━"
echo ""

tips=()

if [ -f /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor ]; then
  gov=$(cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor)
  if [ "$gov" != "performance" ]; then
    tips+=("CPU governor is '$gov' — set to 'performance' for fixed frequency:")
    tips+=("  sudo cpupower frequency-set -g performance")
    tips+=("")
  fi
fi

if [ -f /sys/devices/system/cpu/cpufreq/boost ]; then
  boost=$(cat /sys/devices/system/cpu/cpufreq/boost)
  if [ "$boost" = "1" ]; then
    tips+=("CPU boost is enabled — disable to prevent thermal-dependent frequency:")
    tips+=("  echo 0 | sudo tee /sys/devices/system/cpu/cpufreq/boost")
    tips+=("")
  fi
elif [ -f /sys/devices/system/cpu/intel_pstate/no_turbo ]; then
  no_turbo=$(cat /sys/devices/system/cpu/intel_pstate/no_turbo)
  if [ "$no_turbo" = "0" ]; then
    tips+=("Intel Turbo Boost is enabled — disable to prevent thermal-dependent frequency:")
    tips+=("  echo 1 | sudo tee /sys/devices/system/cpu/intel_pstate/no_turbo")
    tips+=("")
  fi
fi

tips+=("Close other applications to reduce CPU contention")
tips+=("Run multiple times — if deltas flip sign between runs, they're noise")

for tip in "${tips[@]}"; do
  echo "  $tip"
done
echo ""
