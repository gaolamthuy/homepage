# 👤 Solo Dev - Quick Notes

## 🎯 Workflow đơn giản cho solo dev

Vì project chỉ có 1 người, workflow có thể đơn giản hơn:

### Workflow cơ bản:

```bash
# 1. Develop trên staging
git checkout staging
git pull origin staging
# ... make changes ...
git add .
git commit -m "feat: Tính năng mới"
git push origin staging

# 2. Merge vào main (khi ready)
# Option A: Tạo PR để review (khuyến nghị)
# Option B: Merge trực tiếp (nhanh hơn)
git checkout main
git merge staging
git push origin main
```

## ✅ Không cần thiết cho solo dev:

- ❌ Branch protection rules (có thể bỏ qua)
- ❌ PR approvals (tự mình approve)
- ❌ Code review process phức tạp

## ✅ Nên giữ:

- ✅ 2 branches: `main` (prod) và `staging` (preview)
- ✅ Auto-deploy với GitHub Actions
- ✅ Commit message conventions (để dễ track)
- ✅ Pre-commit hooks (nếu muốn)

## 💡 Tips:

1. **Có thể merge trực tiếp vào main** nếu đã test kỹ trên staging
2. **Vẫn nên tạo PR** đôi khi để review code và document changes
3. **Giữ workflow đơn giản** nhưng có structure để dễ mở rộng sau này

## 🔄 Khi nào dùng PR vs Merge trực tiếp?

**Dùng PR khi:**
- Tính năng lớn, cần review kỹ
- Muốn document changes rõ ràng
- Muốn giữ history tốt hơn

**Merge trực tiếp khi:**
- Fix nhỏ, đơn giản
- Đã test kỹ trên staging
- Cần deploy nhanh

