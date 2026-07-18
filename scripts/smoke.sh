#!/usr/bin/env bash
# SSR smoke test: hit every route on the running dev server, assert HTTP 200
# and that a route-specific marker string is present in the rendered HTML.
set -u
BASE="${BASE:-http://localhost:3000}"
fail=0
pass=0

check() {
  local path="$1" needle="$2"
  local body code
  body=$(curl -s -w $'\n%{http_code}' "$BASE$path")
  code=$(printf '%s' "$body" | tail -1)
  body=$(printf '%s' "$body" | sed '$d')
  if [ "$code" != "200" ]; then
    echo "FAIL  $path  (HTTP $code)"
    fail=$((fail+1)); return
  fi
  if ! printf '%s' "$body" | grep -qF "$needle"; then
    echo "FAIL  $path  (missing: $needle)"
    fail=$((fail+1)); return
  fi
  echo "ok    $path"
  pass=$((pass+1))
}

# Buyer
check "/"                                 "Expertly crafted"
check "/project/crimson"                  "Crimson"
check "/explore"                          "Pick a tower to explore"
check "/explore/T1"                       "Aravalli"
check "/explore/T1/12"                    "available on this floor"
check "/unit/T1-12A"                      "All-inclusive price"
check "/unit/T1-12A/cost-sheet"           "Grand total"
check "/unit/T1-12A/book"                 "Held for you"
check "/compare?u=T1-12A,T2-11B"          "Compare flats"
check "/shortlist"                        "Saved flats"
check "/visit?u=T1-12A"                   "Book a site visit"
check "/tools/emi?price=12500000"         "EMI"
check "/progress"                         "Construction updates"
check "/my-home"                          "Welcome back"
check "/my-home/ledger"                   "Digital Khata"
check "/my-home/demand"                   "What got built"
check "/my-home/snagging"                 "Snagging checklist"
check "/my-home/documents"                "My documents"
# Booked unit should NOT show the reserve CTA path (redirects away from /book)
check "/unit/T2-11B"                      "BHK"

# Associate
check "/broker"                           "Associate portal"
check "/broker/inventory"                 "Live inventory"
check "/broker/leads"                     "My leads"
check "/broker/commissions"               "Commission ledger"

# Admin
check "/admin"                            "Cockpit"
check "/admin/inventory"                  "rate cards"
check "/admin/collections"                "Collections cockpit"
check "/admin/approvals"                  "Approvals"
check "/admin/progress"                   "Certify construction"

echo "-----------------------------------------"
echo "PASS: $pass   FAIL: $fail"
exit $fail
