# Server-side API smoke for #185 — credentials via env vars only.
param(
  [string]$Email = $env:SMOKE_EMAIL,
  [string]$Password = $env:SMOKE_PASSWORD,
  [string]$ApiBase = "https://api.mosaicbizhub.com",
  [string]$OutFile = "docs/frontend/evidence/service-publication/api-smoke-results.json"
)

$ErrorActionPreference = "Stop"
if (-not $Email -or -not $Password) { throw "Set SMOKE_EMAIL and SMOKE_PASSWORD." }

function Invoke-Api {
  param([string]$Method, [string]$Path, $Body = $null, $Session)
  $uri = "$ApiBase$Path"
  $params = @{ Uri = $uri; Method = $Method; WebSession = $Session; UseBasicParsing = $true }
  if ($null -ne $Body) { $params.Body = ($Body | ConvertTo-Json -Depth 12); $params.ContentType = "application/json" }
  try {
    $r = Invoke-WebRequest @params
    $json = $null; try { $json = $r.Content | ConvertFrom-Json } catch {}
    return @{ status = [int]$r.StatusCode; body = $json; raw = $r.Content }
  } catch {
    $status = [int]$_.Exception.Response.StatusCode.value__
    $raw = ""; if ($_.Exception.Response) { $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream()); $raw = $reader.ReadToEnd() }
    $json = $null; try { $json = $raw | ConvertFrom-Json } catch {}
    return @{ status = $status; body = $json; raw = $raw }
  }
}

function Sanitize-Response($resp) {
  if (-not $resp) { return $null }
  $summary = $null
  if ($resp.body) {
    $b = $resp.body | ConvertTo-Json -Depth 8 -Compress
    $b = $b -replace 'eyJ[A-Za-z0-9_\-\.]+', '[REDACTED_JWT]'
    $summary = $b.Substring(0, [Math]::Min(1500, $b.Length))
  } elseif ($resp.raw) {
    $summary = $resp.raw.Substring(0, [Math]::Min(500, $resp.raw.Length))
  }
  return @{ status = $resp.status; bodySummary = $summary; hasPublicationBlock = ($summary -match '"publication"') }
}

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$results = @{ testedAt = (Get-Date).ToUniversalTime().ToString("o"); apiBase = $ApiBase; scenarios = @{} }

$login = Invoke-Api POST "/api/users/login" @{ email = $Email; password = $Password; role = "business_owner" } $session
$results.scenarios.s8_auth_login = Sanitize-Response $login
$results.scenarios.s8_auth_check = Sanitize-Response (Invoke-Api GET "/api/users/auth/check" $null $session)

$businessMy = Invoke-Api GET "/api/business/my" $null $session
$businessId = $businessMy.body.businesses[0]._id
$businessSlug = $businessMy.body.businesses[0].slug
$list = Invoke-Api GET "/api/private/services/list?businessId=$businessId&page=1&limit=20" $null $session
$serviceId = $list.body.data[0]._id

$childPayload = @{
  name = "Smoke Child"
  description = "Automated smoke child"
  durationMinutes = 30
  price = 25
}
$publishBody = @{
  isPublished = $true
  title = "Smoke Parent API"
  description = "Smoke test parent service"
  price = 25
  duration = "30 min"
  services = @($childPayload)
}
$draftBody = @{
  isPublished = $false
  title = "Smoke Parent API"
  description = "Smoke test parent service"
  price = 25
  duration = "30 min"
  services = @($childPayload)
}
$editBody = @{
  isPublished = $true
  title = "Smoke Parent API Edited"
  description = "Smoke test parent service edited"
  price = 35
  duration = "45 min"
  services = @(@{ name = "Smoke Child"; description = "edited child"; durationMinutes = 45; price = 35 })
}

# S1 draft
$results.scenarios.s1_save_draft = Sanitize-Response (Invoke-Api PUT "/api/service/$serviceId" $draftBody $session)
$results.scenarios.s1_private_list = Sanitize-Response (Invoke-Api GET "/api/private/services/list?businessId=$businessId&page=1&limit=20" $null $session)
$results.scenarios.s1_public_list = Sanitize-Response (Invoke-Api GET "/api/services/list?page=1&limit=20&search=Smoke%20Parent%20API" $null $session)
$results.scenarios.s1_public_detail = Sanitize-Response (Invoke-Api GET "/api/public/services/$serviceId" $null $session)

# S2 publish draft
$pub = Invoke-Api PUT "/api/service/$serviceId" $publishBody $session
$results.scenarios.s2_publish_draft = Sanitize-Response $pub
$results.scenarios.s2_public_detail = Sanitize-Response (Invoke-Api GET "/api/public/services/$serviceId" $null $session)
$results.scenarios.s2_public_list = Sanitize-Response (Invoke-Api GET "/api/services/list?page=1&limit=20&search=Smoke%20Parent%20API" $null $session)

# S3 publish path already covered by s2 (same service PUT publish)

# S4 edit published
$results.scenarios.s4_edit_published = Sanitize-Response (Invoke-Api PUT "/api/service/$serviceId" $editBody $session)
$results.scenarios.s4_public_detail = Sanitize-Response (Invoke-Api GET "/api/public/services/$serviceId" $null $session)

# S5 unpublish
$results.scenarios.s5_unpublish = Sanitize-Response (Invoke-Api PUT "/api/service/$serviceId" $draftBody $session)
$results.scenarios.s5_public_detail = Sanitize-Response (Invoke-Api GET "/api/public/services/$serviceId" $null $session)
$results.scenarios.s5_public_list = Sanitize-Response (Invoke-Api GET "/api/services/list?page=1&limit=20&search=Smoke%20Parent%20API%20Edited" $null $session)

# S6 validation failure
$invalidBody = @{ isPublished = $true; services = @(@{ name = ""; durationMinutes = 0; price = 0 }) }
$results.scenarios.s6_validation_failure = Sanitize-Response (Invoke-Api PUT "/api/service/$serviceId" $invalidBody $session)

# S8 unauthenticated owner read
$results.scenarios.s8_unauthenticated_owner_get = Sanitize-Response (Invoke-Api GET "/api/service/$serviceId" $null (New-Object Microsoft.PowerShell.Commands.WebRequestSession))

# Restore published state for public QA screenshots
Invoke-Api PUT "/api/service/$serviceId" $editBody $session | Out-Null

$results.meta = @{
  businessId = $businessId
  businessSlug = $businessSlug
  serviceId = $serviceId
  backendMergeSha = "79444917e925c392feec58365bb4e6e1ed115bea"
  backendPr = 108
  previewUrl = "https://mosaic-biz-frontend-launch-git-fix-fron-da2943-digital-builders.vercel.app"
  corsPreviewPreflightLogin = 500
  corsProductionPreflightLogin = 204
  publicationBlockOnOwnerMutations = ($pub.body.publication -ne $null)
  testVendorLabel = "TestVendor-A"
}

$dir = Split-Path $OutFile -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$results | ConvertTo-Json -Depth 10 | Set-Content -Path $OutFile -Encoding utf8
Write-Host "Wrote $OutFile"
