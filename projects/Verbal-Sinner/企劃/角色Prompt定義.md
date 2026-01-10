# 角色 Prompt 定義

## 說明

本文檔定義了遊戲中所有角色的固定 Prompt，確保在 ComfyUI 中生成圖片時，每個角色保持視覺一致性。

**使用原則**：
- 每個角色的 Prompt 必須固定，不可隨意修改
- 生成圖片時，必須使用對應角色的固定 Prompt
- 如需調整，必須更新本文檔並記錄版本

---

## 角色 Prompt 庫

### 主角（玩家角色）

#### 主角 - 基礎 Prompt
```
Base Character Prompt:
A person in their late 20s to early 30s, Asian features, average build, tired and exhausted expression, wearing casual office wear or simple clothing, looking confused, angry, desperate, or hopeless depending on the scene, dark circles under eyes, disheveled hair, cold and pale skin tone, film noir style, realistic rendering, high contrast lighting

Consistent Features:
- Age: Late 20s to early 30s
- Build: Average, slightly thin (from stress)
- Expression: Tired, exhausted, emotional (varies by scene)
- Clothing: Casual office wear, simple and worn
- Skin Tone: Pale, cold tone
- Hair: Disheveled, unkempt
- Eyes: Dark circles, tired look

Style: Realistic, film noir, high contrast, dramatic lighting
Model: RealisticVision or ChilloutMix
Seed Range: 1000-1999
```

#### 主角 - 不同情緒狀態

**困惑/憤怒/絕望（場景一、二、三）**
```
[主角基礎 Prompt], confused angry desperate expression, furrowed brows, clenched jaw, eyes showing pain and frustration, dramatic lighting, high contrast
```

**震驚/憤怒/失望（場景二）**
```
[主角基礎 Prompt], shocked angry disappointed expression, wide eyes, open mouth, disbelief in expression, dramatic lighting
```

**痛苦/憤怒/絕望（場景三）**
```
[主角基礎 Prompt], pained angry desperate expression, tears in eyes, clenched fists, emotional breakdown, dramatic lighting
```

**絕望/無力/孤獨（場景四）**
```
[主角基礎 Prompt], hopeless powerless lonely expression, empty eyes, slumped shoulders, walking alone, dramatic lighting, cold color tone
```

---

### 同事A（職場陷害者）

#### 同事A - 基礎 Prompt
```
Colleague A Character Prompt:
A man in his early 30s, Asian features, well-groomed appearance, wearing professional business attire, friendly smile on surface but with subtle calculating eyes, slightly taller than average, confident posture, well-maintained hair, clean-shaven, professional appearance

Consistent Features:
- Age: Early 30s
- Build: Average to slightly athletic
- Expression: Surface friendly, but eyes show calculation
- Clothing: Professional business attire, well-fitted
- Hair: Well-groomed, professional style
- Posture: Confident, slightly dominant
- Eyes: Friendly but calculating, observant

Personality Traits (affects expression):
- Surface: Friendly, helpful, approachable
- Hidden: Calculating, jealous, manipulative

Style: Realistic, professional, subtle tension
Model: RealisticVision
Seed Range: 2000-2999
```

#### 同事A - 不同場景

**模糊出現（場景一、二）**
```
[同事A基礎 Prompt], gaussian blur 40-60%, appearing in background, observing, subtle presence, cold color tone
```

**會議室場景（場景一）**
```
[同事A基礎 Prompt], in meeting room, standing near documents, subtle smile, eyes showing calculation, professional setting, dramatic lighting
```

---

### 朋友B（背叛者）

#### 朋友B - 基礎 Prompt
```
Friend B Character Prompt:
A person in their late 20s, Asian features, friendly and approachable appearance, wearing casual trendy clothing, warm smile on surface but with opportunistic eyes, average build, well-dressed, social appearance, coffee shop aesthetic

Consistent Features:
- Age: Late 20s
- Build: Average
- Expression: Surface warm, but eyes show opportunism
- Clothing: Casual trendy, well-coordinated
- Hair: Stylish, well-maintained
- Posture: Relaxed, social, approachable
- Eyes: Warm but opportunistic, observant

Personality Traits (affects expression):
- Surface: Warm, friendly, supportive
- Hidden: Opportunistic, selfish, calculating

Style: Realistic, casual, social setting
Model: RealisticVision
Seed Range: 3000-3999
```

#### 朋友B - 不同場景

**模糊出現（場景二）**
```
[朋友B基礎 Prompt], gaussian blur 40-60%, appearing in background, phone in hand, observing, subtle presence, cold color tone
```

**聊天記錄場景（場景二）**
```
[朋友B基礎 Prompt], looking at phone, chat messages visible, subtle guilty expression, cold color tone, dramatic lighting
```

---

### 情人C（傷害者）

#### 情人C - 基礎 Prompt
```
Lover C Character Prompt:
A person in their late 20s to early 30s, Asian features, attractive appearance, wearing stylish casual or semi-formal clothing, gentle smile on surface but with distant eyes, average to slim build, well-groomed, romantic appearance, dating scene aesthetic

Consistent Features:
- Age: Late 20s to early 30s
- Build: Average to slim
- Expression: Surface gentle, but eyes show distance
- Clothing: Stylish casual or semi-formal, fashionable
- Hair: Well-styled, attractive
- Posture: Relaxed, charming, but distant
- Eyes: Gentle but distant, avoiding deep connection

Personality Traits (affects expression):
- Surface: Gentle, caring, romantic
- Hidden: Distant, cold, afraid of commitment

Style: Realistic, romantic but cold undertone
Model: RealisticVision
Seed Range: 4000-4999
```

#### 情人C - 不同場景

**模糊出現（場景三）**
```
[情人C基礎 Prompt], gaussian blur 40-60%, appearing in background, looking at phone, distant expression, cold color tone
```

**社群動態場景（場景三）**
```
[情人C基礎 Prompt], looking at phone, social media feed visible, photos without main character, distant expression, cold color tone, dramatic lighting
```

---

### 主管（幕後黑手？）

#### 主管 - 基礎 Prompt
```
Boss Character Prompt:
A man in his late 30s to early 40s, Asian features, authoritative appearance, wearing formal business suit, serious expression with subtle uncertainty in eyes, taller than average, commanding presence, well-maintained appearance, office authority aesthetic

Consistent Features:
- Age: Late 30s to early 40s
- Build: Average to slightly heavy (authority)
- Expression: Serious, but eyes show uncertainty
- Clothing: Formal business suit, professional
- Hair: Well-groomed, professional style
- Posture: Authoritative, commanding, but slightly uncertain
- Eyes: Serious but uncertain, easily influenced

Personality Traits (affects expression):
- Surface: Authoritative, fair, professional
- Hidden: Uncertain, easily influenced, lacks judgment

Style: Realistic, professional, authority setting
Model: RealisticVision
Seed Range: 5000-5999
```

#### 主管 - 不同場景

**模糊出現（場景一）**
```
[主管基礎 Prompt], gaussian blur 40-60%, appearing in background, observing, subtle presence, cold color tone
```

**會議室場景（場景一）**
```
[主管基礎 Prompt], in meeting room, standing at head of table, serious expression, eyes showing uncertainty, professional setting, dramatic lighting
```

---

## 場景 Prompt 模板

### 場景一：職場慢性凌遲

#### 圖片1：辦公室全景（夜晚）
```
Scene: Office at night, wide angle shot, most lights off, only one desk light on (warm yellow), cold blue-gray color tone, dark atmosphere, dramatic lighting, film noir style, high contrast, 1920x1080

Characters: [主角 - 困惑/憤怒/絕望] (sitting at desk with light)

Negative: bright, cheerful, daytime, colorful, happy, crowded
```

#### 圖片2：會議室場景
```
Scene: Meeting room, medium shot, documents on table, name crossed out and replaced, cold color tone, shadows, dramatic lighting, film noir style, 1920x1080

Characters: 
- [主角 - 困惑/憤怒/絕望] (looking at documents)
- [同事A - 會議室場景] (standing near documents, blurred 40-60%)
- [主管 - 會議室場景] (standing at head, blurred 40-60%)

Negative: clear faces, bright, cheerful, daytime
```

### 場景二：朋友的背叛

#### 圖片1：深夜房間 + 手機
```
Scene: Dark room at night, close-up shot, only phone screen light, cold blue-gray color tone, dramatic lighting, film noir style, 1920x1080

Characters: [主角 - 震驚/憤怒/失望] (holding phone, looking at contact list)

Props: Phone showing contact list, name faded out

Negative: bright, daytime, cheerful
```

#### 圖片2：聊天記錄
```
Scene: Dark room, medium shot, chat messages on screen, cold color tone, shadows, dramatic lighting, 1920x1080

Characters:
- [主角 - 震驚/憤怒/失望] (looking at phone)
- [朋友B - 聊天記錄場景] (blurred 40-60% in background)

Props: Phone showing chat messages, secrets forwarded, calendar 2020

Negative: clear faces, bright, happy
```

### 場景三：愛情只是交易

#### 圖片1：社群動態
```
Scene: Dark room, close-up shot, phone screen, social media feed, cold color tone, dramatic lighting, 1920x1080

Characters: [主角 - 痛苦/憤怒/絕望] (looking at phone)

Props: Phone showing social media feed, person not in photos, gifts appear in others' photos

Negative: bright, happy couples, cheerful
```

### 場景四：被榨乾的一天

#### 圖片1：深夜街道
```
Scene: Late night street 2024, wide shot, almost empty, cold blue-gray color tone, dramatic lighting, film noir style, 1920x1080

Characters: [主角 - 絕望/無力/孤獨] (walking alone, tired and desperate)

Props: Car headlights in distance (unusual angle, seems intentional)

Negative: crowded, daytime, bright, cheerful
```

#### 圖片4：孤獨的街道（準備死亡）
```
Scene: Late night street, wide shot, almost completely dark, cold color tone, fading to dark, dramatic lighting, 1920x1080

Characters: [主角 - 絕望/無力/孤獨] (standing alone)

Props: Car headlights approaching with unusual angle

Negative: bright, daytime, crowded
```

### 場景五：死亡發生

#### 圖片1：街道場景
```
Scene: Late night street 2024, wide shot, cold color tone, dramatic lighting, 1920x1080

Characters: [主角 - 絕望/無力/孤獨] (walking alone)

Props: Car headlights in distance (unusual angle, seems intentional)

Negative: bright, safe, normal traffic
```

#### 圖片2：強烈白光
```
Scene: Extreme close-up, intense white light, car headlights suddenly bright, full white screen, high contrast, dramatic, 1920x1080

Characters: [模糊人影] (may be person pushing or in car, blurred figure in light)

Negative: dark, soft light
```

#### 圖片3：撞擊瞬間
```
Scene: Extreme close-up, blurred motion, fast movement, impact moment, high contrast, dramatic, 1920x1080

Characters: [主角] (being hit, blurred motion)

Props: Phone falling, screen shattered, blurred figure in car or behind

Negative: clear, stable, calm
```

#### 圖片4：手機螢幕（最後的意識）
```
Scene: Extreme close-up, completely dark, gradually fading, dramatic, 1920x1080

Characters: [模糊人影] (may be killer, unclear, blurred in background)

Props: Shattered phone screen lights up, 0 unread messages, calendar 2024, question marks appearing, clue fragments appearing

Negative: bright, clear, happy
```

### 場景六：你不在之後

#### 圖片1：模糊的人影
```
Scene: Wide shot, cold color tone, dramatic lighting, 1920x1080

Characters: [模糊人影群] (gaussian blur, people walking past quickly with motion blur, no one looking back)

Negative: clear faces, bright, cheerful
```

#### 圖片2：垃圾袋
```
Scene: Medium shot, garbage bag, cold color tone, shadows, dramatic lighting, 1920x1080

Characters: [模糊人影] (observing, gaussian blur 40-60%)

Props: Garbage bag, belongings being thrown in, question marks, clue fragments

Negative: bright, organized, clear
```

---

## 技術參數標準

### 通用設定
```
Resolution: 1920x1080 (16:9)
Model: RealisticVision V5.1 or ChilloutMix
VAE: vae-ft-mse-840000-ema-pruned.safetensors
Steps: 25-30
CFG Scale: 7-9
Sampler: DPM++ 2M Karras or Euler a
```

### 角色專用 Seed 範圍
- 主角: 1000-1999
- 同事A: 2000-2999
- 朋友B: 3000-3999
- 情人C: 4000-4999
- 主管: 5000-5999
- 場景: 6000-9999

### 風格設定
```
Style: Realistic, film noir, high contrast, dramatic lighting
Color Tone: Cold blue-gray, desaturated, high contrast
Mood: Dark, suspenseful, emotional, dramatic
```

---

## 後製處理標準

### 高斯模糊（關鍵人物）
- **透明度**: 40-60%
- **應用對象**: 同事A、朋友B、情人C、主管在背景出現時
- **工具**: ComfyUI ImageBlur 節點 或 Photoshop/GIMP

### 半透明效果（問號、線索碎片）
- **透明度**: 30-50%
- **應用對象**: 問號符號、線索碎片
- **工具**: 後製軟體圖層透明度調整

### 動態模糊（人群）
- **強度**: 中等
- **應用對象**: 快速移動的人群
- **工具**: ComfyUI ImageMotionBlur 節點 或 Photoshop 動態模糊濾鏡

### 色彩調整
- **色調**: 冷色調（藍灰色）
- **對比度**: 高對比
- **飽和度**: 低飽和度
- **工具**: ComfyUI ColorCorrect 節點 或 後製軟體

---

## 版本記錄

### v1.0 (2024-01-XX)
- 初始版本
- 定義所有角色的基礎 Prompt
- 建立場景 Prompt 模板
- 設定技術參數標準

---

## 使用說明

1. **選擇角色 Prompt**：從角色 Prompt 庫中選擇對應角色
2. **選擇場景模板**：從場景 Prompt 模板中選擇對應場景
3. **組合 Prompt**：將角色 Prompt 和場景 Prompt 組合
4. **設定技術參數**：使用標準技術參數
5. **生成測試**：先生成測試圖片確認效果
6. **後製處理**：根據需要進行模糊、透明度等後製
7. **記錄結果**：記錄使用的 Prompt 和生成結果

---

**注意事項**：
- 所有角色的 Prompt 必須固定，不可隨意修改
- 如需調整，必須更新本文檔並記錄版本
- 生成圖片時，必須使用對應角色的固定 Prompt
- 保持風格一致性，使用相同的模型和參數

