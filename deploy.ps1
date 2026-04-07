Write-Host "🎨 Assets kopyalaniyor..."
New-Item -ItemType Directory -Force -Path "C:\Users\pc\Desktop\Artigami\assets" | Out-Null

$brainDir = "C:\Users\pc\.gemini\antigravity\brain\f0123b49-12bd-47fc-9092-563e85022ba3"
Copy-Item "$brainDir\origami_museum_installation_*.png" "C:\Users\pc\Desktop\Artigami\assets\origami_museum.png" -Force
Copy-Item "$brainDir\origami_corporate_hall_*.png" "C:\Users\pc\Desktop\Artigami\assets\origami_corporate.png" -Force
Copy-Item "$brainDir\origami_spatial_art_*.png" "C:\Users\pc\Desktop\Artigami\assets\origami_spatial.png" -Force

Write-Host "⚙️ Git baslatiliyor..."
cd C:\Users\pc\Desktop\Artigami
git init
git add .
git commit -m "Initial commit - Artigami Premium V1"

Write-Host "🌐 GitHub Reposu (YSayginarWEB) aciliyor..."
gh repo create YSayginarWEB --public --source=. --remote=origin --push

Write-Host "✅ Islem tamamlandi! Github repona gidip Ayarlar > Pages bolumunden aktif edebilirsin."
pause
