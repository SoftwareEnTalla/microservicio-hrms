#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — hrms-service (puerto 3017)
# Módulos: hrmss, employees, persons, personattributes, employeeattributes,
#          attendances, leaverequests, payrolls, trainings, accesscontrols,
#          hrmspermissionss, reportss, configurationparameters,
#          catalogsynclogs, catalog-client
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3017/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — HRMS Microservice — 100% UH + Swagger            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/hrmss/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 Hrms"
P=$(cat <<EOF
{"name":"E2E Hrms ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"HRMS-${UNIQUE}","metadata":{"e2e":true}}
EOF
)
smoke_module "hrmss" "$P"

log_step 2 "UH-2 Employee"
P=$(cat <<EOF
{"name":"E2E Employee ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"EMP-${UNIQUE}","personId":"00000000-0000-0000-0000-000000000001",
 "hireDate":"${TIMESTAMP}","status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "employees" "$P"

log_step 3 "UH-3 Person"
P=$(cat <<EOF
{"name":"E2E Person ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PRS-${UNIQUE}","firstName":"John","lastName":"Doe","email":"john-${UNIQUE}@e2e.test","metadata":{"e2e":true}}
EOF
)
smoke_module "persons" "$P"

log_step 4 "UH-4 PersonAttribute"
P=$(cat <<EOF
{"name":"E2E PA ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PRS-ATTR-${UNIQUE}","personId":"00000000-0000-0000-0000-000000000001",
 "key":"nationality","value":"ES","metadata":{"e2e":true}}
EOF
)
smoke_module "personattributes" "$P"

log_step 5 "UH-5 EmployeeAttribute"
P=$(cat <<EOF
{"name":"E2E EA ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"EMP-ATTR-${UNIQUE}","employeeId":"00000000-0000-0000-0000-000000000001",
 "key":"department","value":"IT","metadata":{"e2e":true}}
EOF
)
smoke_module "employeeattributes" "$P"

log_step 6 "UH-6 Attendance"
P=$(cat <<EOF
{"name":"E2E Att ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"ATT-${UNIQUE}","employeeId":"00000000-0000-0000-0000-000000000001",
 "date":"${TIMESTAMP}","status":"PRESENT","metadata":{"e2e":true}}
EOF
)
smoke_module "attendances" "$P"

log_step 7 "UH-7 LeaveRequest"
P=$(cat <<EOF
{"name":"E2E LR ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"LR-${UNIQUE}","employeeId":"00000000-0000-0000-0000-000000000001",
 "startDate":"${TIMESTAMP}","endDate":"${TIMESTAMP}","status":"PENDING","metadata":{"e2e":true}}
EOF
)
smoke_module "leaverequests" "$P"

log_step 8 "UH-8 Payroll"
P=$(cat <<EOF
{"name":"E2E Pay ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PAY-${UNIQUE}","employeeId":"00000000-0000-0000-0000-000000000001",
 "period":"2026-04","grossAmount":3000.0,"metadata":{"e2e":true}}
EOF
)
smoke_module "payrolls" "$P"

log_step 9 "UH-9 Training"
P=$(cat <<EOF
{"name":"E2E Tr ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"TR-${UNIQUE}","title":"E2E Training","status":"SCHEDULED","metadata":{"e2e":true}}
EOF
)
smoke_module "trainings" "$P"

log_step 10 "UH-10 AccessControl"
P=$(cat <<EOF
{"name":"E2E AC ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"AC-${UNIQUE}","employeeId":"00000000-0000-0000-0000-000000000001",
 "resource":"building","level":"FULL","metadata":{"e2e":true}}
EOF
)
smoke_module "accesscontrols" "$P"

log_step 11 "UH-11 HrmsPermissions"
P=$(cat <<EOF
{"name":"E2E HP ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"HP-${UNIQUE}","permissionName":"READ_EMPLOYEES","metadata":{"e2e":true}}
EOF
)
smoke_module "hrmspermissionss" "$P"

log_step 12 "UH-12 Reports"
P=$(cat <<EOF
{"name":"E2E Rep ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"REP-${UNIQUE}","reportType":"ATTENDANCE","metadata":{"e2e":true}}
EOF
)
smoke_module "reportss" "$P"

log_step 13 "UH-13 ConfigurationParameter"
P=$(cat <<EOF
{"name":"E2E CP ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"CP-${UNIQUE}","key":"E2E_KEY","value":"E2E_VALUE","metadata":{"e2e":true}}
EOF
)
smoke_module "configurationparameters" "$P"

log_step 14 "UH-14 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"hrms-status","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 15 "UH-15 catalog-client"
smoke_catalog_client

log_step 16 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*hrms[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics hrms.* detectados"; else log_warn "Sin topics hrms.*"; fi
else log_warn "kcat no instalado — skipping"; fi

print_summary "hrms-service"
