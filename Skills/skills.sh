#!/usr/bin/env bash
# Skills installer / updater for the Ische Ghuree (ইচ্ছে ঘুড়ি) project.
#
# Installs project-local skills under .claude/skills/ and registers any
# CLAUDE.md sections + hooks the skills need.
#
# Usage:
#   bash Skills/skills.sh install   # install or refresh all skills (default)
#   bash Skills/skills.sh update    # alias for install
#   bash Skills/skills.sh status    # show what's installed
#   bash Skills/skills.sh uninstall # remove all skills

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CMD="${1:-install}"

log()  { printf '  %s\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*" >&2; }
err()  { printf '  \033[31m✗\033[0m %s\n' "$*" >&2; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "missing required command: $1"
    return 1
  fi
}

# Project-local skills tracked in this repo. Each entry is just the directory
# name under .claude/skills/ — the SKILL.md inside it is the source of truth.
LOCAL_SKILLS=(
  prisma
  nodemailer-gmail
  next-app-router
  tailwind-v4-theme
  react-hook-form-zod
  cloudinary-media
)

# ---------- skill: graphify ----------
# Knowledge-graph builder. Registers a /graphify slash command in Claude Code,
# writes a CLAUDE.md section, and installs a PreToolUse hook in
# .claude/settings.json.
graphify_install() {
  log "[graphify] installing..."
  require_cmd python || { err "install Python 3.10+ first"; return 1; }
  require_cmd pip    || { err "pip is required"; return 1; }

  if ! command -v graphify >/dev/null 2>&1; then
    log "[graphify] pip install graphifyy ..."
    pip install --quiet graphifyy \
      || pip install --quiet "git+https://github.com/safishamsi/graphify.git"
  else
    log "[graphify] already installed: $(graphify --help 2>&1 | head -n1)"
  fi

  # Register skill globally (~/.claude/skills/graphify/) and project-locally
  graphify install --platform claude >/dev/null
  graphify claude install >/dev/null

  # Mirror the skill into the project so it travels with the repo.
  local user_skill="${HOME:-$USERPROFILE}/.claude/skills/graphify"
  local proj_skill="$ROOT/.claude/skills/graphify"
  if [ -d "$user_skill" ]; then
    mkdir -p "$proj_skill"
    cp -f "$user_skill"/* "$proj_skill"/ 2>/dev/null || true
  fi

  ok "graphify installed (project + user scope)"
}

graphify_status() {
  if command -v graphify >/dev/null 2>&1; then
    ok "graphify CLI: $(graphify --help 2>&1 | head -n1)"
  else
    warn "graphify CLI not on PATH"
  fi
  [ -f "$ROOT/.claude/skills/graphify/SKILL.md" ] \
    && ok "project SKILL.md present" \
    || warn "project SKILL.md missing"
  [ -f "$ROOT/graphify-out/graph.json" ] \
    && ok "graph built ($(wc -c <"$ROOT/graphify-out/graph.json") bytes)" \
    || warn "graph not built yet — run: graphify ."
}

graphify_uninstall() {
  log "[graphify] uninstalling..."
  command -v graphify >/dev/null 2>&1 && graphify claude uninstall >/dev/null || true
  rm -rf "$ROOT/.claude/skills/graphify"
  ok "graphify removed (pip package left intact)"
}

# ---------- project-local skills ----------
# These are pure markdown SKILL.md files committed to the repo. "Install" just
# verifies they exist; Claude Code auto-discovers any directory under
# .claude/skills/ that contains a SKILL.md with valid frontmatter.
local_skills_install() {
  for name in "${LOCAL_SKILLS[@]}"; do
    local skill_dir="$ROOT/.claude/skills/$name"
    local skill_md="$skill_dir/SKILL.md"
    if [ -f "$skill_md" ]; then
      ok "$name (.claude/skills/$name/SKILL.md)"
    else
      warn "$name SKILL.md missing at $skill_md"
    fi
  done
}

local_skills_status() {
  for name in "${LOCAL_SKILLS[@]}"; do
    local skill_md="$ROOT/.claude/skills/$name/SKILL.md"
    if [ -f "$skill_md" ]; then
      local desc
      desc=$(awk -F': ' '/^description:/ { sub(/^"/, "", $2); sub(/"$/, "", $2); print $2; exit }' "$skill_md")
      ok "$name — ${desc:-(no description)}"
    else
      warn "$name missing"
    fi
  done
}

local_skills_uninstall() {
  for name in "${LOCAL_SKILLS[@]}"; do
    local skill_dir="$ROOT/.claude/skills/$name"
    if [ -d "$skill_dir" ]; then
      rm -rf "$skill_dir"
      ok "$name removed"
    fi
  done
}

# ---------- dispatch ----------
case "$CMD" in
  install|update)
    graphify_install
    log ""
    log "[local skills] verifying project SKILL.md files..."
    local_skills_install
    ;;
  status)
    log "[graphify]"
    graphify_status
    log ""
    log "[local skills]"
    local_skills_status
    ;;
  uninstall)
    graphify_uninstall
    log ""
    log "[local skills] removing..."
    local_skills_uninstall
    ;;
  *)
    cat <<USAGE
Usage: bash Skills/skills.sh <command>

Commands:
  install     install or refresh all skills (default)
  update      alias for install
  status      show what's installed
  uninstall   remove all skills

Skills managed:
  - graphify           knowledge-graph CLI + Claude Code skill (pip-installed)
  - prisma             Prisma 7 + Supabase workflow for backend
  - nodemailer-gmail   Gmail SMTP transactional email pattern
  - next-app-router    Next.js 16 App Router conventions for frontend
  - tailwind-v4-theme  Tailwind v4 + dynamic theme tokens
  - react-hook-form-zod  RHF + Zod validation pattern (used by /order-now)
  - cloudinary-media   multer + sharp/ffmpeg + Cloudinary upload pipeline
USAGE
    exit 2
    ;;
esac
