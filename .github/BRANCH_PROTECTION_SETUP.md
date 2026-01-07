# 🛡️ Hướng dẫn Setup Branch Protection Rules

Hướng dẫn cấu hình branch protection rules trên GitHub để đảm bảo `main` branch chỉ được merge qua Pull Request.

## 📋 Các bước setup

### 1. Vào Repository Settings

1. Vào GitHub repository: `https://github.com/gaolamthuy/homepage`
2. Click **Settings** (tab trên cùng)
3. Click **Branches** (sidebar bên trái)

### 2. Thêm Branch Protection Rule cho `main`

1. Click **Add rule** hoặc **Add branch protection rule**
2. Trong **Branch name pattern**, nhập: `main`
3. Cấu hình các options sau:

#### ✅ Required settings:

- **☑️ Require a pull request before merging**
  - ☑️ Require approvals: `1` (hoặc `0` nếu muốn tự merge)
  - ☑️ Dismiss stale pull request approvals when new commits are pushed
  - ☑️ Require review from Code Owners (nếu có file CODEOWNERS)

- **☑️ Require status checks to pass before merging**
  - ☑️ Require branches to be up to date before merging
  - Add status checks:
    - `Deploy Production to Cloudflare Pages` (từ GitHub Actions)

- **☑️ Require conversation resolution before merging**
  - Đảm bảo mọi comments đã được resolve

- **☑️ Include administrators**
  - Áp dụng rules cho cả admin

#### ⚠️ Optional settings:

- **☐ Do not allow bypassing the above settings**
  - Nếu check: Không ai có thể bypass, kể cả admin
  - Nếu không check: Admin có thể bypass trong trường hợp khẩn cấp

- **☐ Restrict who can push to matching branches**
  - Không cần thiết nếu đã có PR requirement

- **☐ Allow force pushes**
  - ❌ **KHÔNG** check (nguy hiểm)

- **☐ Allow deletions**
  - ❌ **KHÔNG** check (nguy hiểm)

### 3. Save changes

Click **Create** hoặc **Save changes**

## 🎯 Kết quả

Sau khi setup:

- ✅ Không thể push trực tiếp vào `main`
- ✅ Phải tạo Pull Request từ `staging` → `main`
- ✅ Phải có approval (nếu set) trước khi merge
- ✅ Status checks phải pass trước khi merge
- ✅ Branches phải up-to-date trước khi merge

## 🔍 Test

### Test 1: Thử push trực tiếp vào main

```bash
git checkout main
# Make some changes
git add .
git commit -m "test: Test direct push"
git push origin main
```

**Kết quả mong đợi**: ❌ Bị reject với message về branch protection

### Test 2: Tạo PR từ staging → main

1. Push changes vào `staging`
2. Tạo PR trên GitHub
3. Merge PR

**Kết quả mong đợi**: ✅ Merge thành công

## 🚨 Emergency Override

Nếu cần merge khẩn cấp và không thể tạo PR:

### Cách 1: Temporarily disable protection (Admin only)

1. Vào Settings → Branches
2. Click vào rule `main`
3. Uncheck các options cần thiết
4. Save
5. Merge/Push
6. Re-enable protection

### Cách 2: Use GitHub CLI

```bash
# Install gh CLI
# https://cli.github.com/

# Merge trực tiếp (cần admin rights)
gh pr create --base main --head staging --title "Emergency fix" --body "Emergency merge"
gh pr merge <pr-number> --merge --admin
```

## 📝 Notes

- Branch protection chỉ áp dụng cho `main`
- `staging` branch vẫn có thể push trực tiếp (theo design)
- Có thể thêm protection cho `staging` nếu muốn (không khuyến nghị cho solo dev)

