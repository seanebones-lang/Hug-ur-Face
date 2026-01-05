# 🔧 HuggingFace Space Fix Report

**Date:** 2026-01-05
**Space:** bizbots/qwen-image-editor
**Issue:** CUDA Out of Memory Error

---

## 🚨 Problem Identified

### Error Details:
```
torch.OutOfMemoryError: CUDA out of memory.
Tried to allocate 72.00 MiB.
GPU 0 has a total capacity of 22.03 GiB of which 51.12 MiB is free.
Including non-PyTorch memory, this process has 21.98 GiB memory in use.
```

### Root Cause:
The Space was trying to load a **20GB model** into a **22GB GPU** at startup with all layers loaded to VRAM simultaneously:

**app.py line 94-103 (BEFORE):**
```python
pipe = QwenImageEditPlusPipeline.from_pretrained(
    "Qwen/Qwen-Image-Edit-2511",
    transformer=QwenImageTransformer2DModel.from_pretrained(
        "linoyts/Qwen-Image-Edit-Rapid-AIO",
        subfolder='transformer',
        torch_dtype=dtype,
        device_map='cuda'  # ❌ Loads EVERYTHING to VRAM
    ),
    torch_dtype=dtype
).to(device)
```

**Problems:**
1. `device_map='cuda'` tries to load all 4 model shards (20GB) into 22GB VRAM
2. No memory optimization or offloading
3. Model loaded 2/4 shards successfully, then crashed on shard 3
4. No CPU fallback or memory management

---

## ✅ Solution Implemented

### Changes Made to `app.py`:

```python
# Lines 94-109 (AFTER)
pipe = QwenImageEditPlusPipeline.from_pretrained(
    "Qwen/Qwen-Image-Edit-2511",
    transformer=QwenImageTransformer2DModel.from_pretrained(
        "linoyts/Qwen-Image-Edit-Rapid-AIO",
        subfolder='transformer',
        torch_dtype=dtype,
        device_map='auto',  # ✅ Automatic device management
        low_cpu_mem_usage=True,  # ✅ Efficient memory loading
        max_memory={0: "20GB", "cpu": "30GB"}  # ✅ Explicit memory limits
    ),
    torch_dtype=dtype
)
```

### What This Does:

1. **`device_map='auto'`** (Changed from `'cuda'`)
   - Automatically distributes model layers across GPU and CPU
   - Offloads layers to CPU when GPU VRAM is full
   - Dynamically manages memory during runtime

2. **`low_cpu_mem_usage=True`** (Added)
   - Loads model weights more efficiently
   - Reduces peak memory usage during loading
   - Uses memory-mapped files when possible

3. **`max_memory={0: "20GB", "cpu": "30GB"}`** (Added)
   - Limits GPU 0 to 20GB (leaving headroom for operations)
   - Allows up to 30GB CPU RAM for offloaded layers
   - Prevents OOM by enforcing limits

4. **Removed `.to(device)`**
   - Device placement now handled by `device_map`
   - Avoids redundant memory operations

---

## 📊 Expected Results

### Memory Usage:
| Component | Before | After |
|-----------|--------|-------|
| Model Loading | 22GB (crashes) | ~18-20GB GPU + CPU overflow |
| VRAM Headroom | 0MB (OOM) | ~2-4GB available |
| Inference | N/A (crashed) | GPU-accelerated with CPU offload |

### Performance:
- **Startup:** May be slower (30-60s) due to CPU offloading setup
- **Inference:** Should be fast (GPU-accelerated for critical layers)
- **Stability:** No more OOM crashes

---

## 🔄 Deployment Status

### Commit Details:
```
Commit: 8b6dd26
Message: "fix: Enable CPU offloading to prevent CUDA OOM errors"
Push Time: 2026-01-05 19:04:40 UTC
```

### Build Progress:
```
RUNTIME_ERROR → BUILDING → APP_STARTING
```

**Current Status:** Space is rebuilding with the fix

---

## 🧪 Testing Checklist

Once the Space is running, test:

### 1. Startup Test:
- [ ] Space starts without OOM errors
- [ ] Model loads successfully
- [ ] No crashes in logs
- [ ] HTTP 200 response from https://bizbots-qwen-image-editor.hf.space

### 2. Basic Generation Test:
- [ ] Upload a test image
- [ ] Enter a simple prompt: "make it more colorful"
- [ ] Select "Base Model (No LoRA)"
- [ ] Generate successfully

### 3. LoRA Adapter Test:
- [ ] Test "Photo-to-Anime" adapter
- [ ] Test "Upscaler" adapter
- [ ] Verify adapters load without errors

### 4. Memory Monitoring:
- [ ] Check Space logs for memory usage
- [ ] Verify no OOM warnings
- [ ] Monitor for 24 hours

---

## 🔍 Monitoring

### Monitor Script Running:
```bash
# Running every 60 seconds
/tmp/monitor_space.sh
PID: <check /tmp/space_monitor.pid>
```

### Manual Status Check:
```bash
curl -s "https://huggingface.co/api/spaces/bizbots/qwen-image-editor" | \
python3 -c "import sys,json; d=json.load(sys.stdin); \
print('Stage:', d.get('runtime', {}).get('stage', 'unknown'))"
```

### Expected Stages:
1. `BUILDING` - Installing dependencies, copying files
2. `APP_STARTING` - Launching Gradio app
3. `RUNNING` - Fully operational ✅

---

## 🎯 Alternative Solutions (Not Needed Now)

If CPU offloading doesn't work well, consider:

### Option A: Upgrade Hardware
```yaml
# README.md
---
sdk: gradio
sdk_version: 6.2.0
hardware: a100-large  # 80GB VRAM
---
```
**Cost:** ~$3/hour

### Option B: Model Quantization
```python
# Load model in 8-bit or 4-bit
from transformers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(load_in_8bit=True)
pipe = ...
```
**Trade-off:** Slightly lower quality, much less memory

### Option C: ZeroGPU (Free but slower)
```python
import spaces

# Only load model when needed
@spaces.GPU(duration=60)
def infer(...):
    # Model loaded here on-demand
    ...
```
**Trade-off:** Cold starts, limited to 60s per generation

---

## 📈 Performance Expectations

### With CPU Offloading:
- **Cold Start:** 30-60 seconds (model loading)
- **Warm Start:** Instant (model cached)
- **Generation Time:** 20-40 seconds per image
- **Memory Stability:** No crashes

### Monitoring Metrics:
- Check GPU utilization: Should be 70-90% during inference
- Check CPU RAM: Will use 5-10GB for offloaded layers
- Check generation success rate: Should be 100%

---

## 🚦 Status Updates

### 19:02 UTC - Issue Reported
- Space in RUNTIME_ERROR state
- OOM error identified in logs

### 19:04 UTC - Fix Deployed
- CPU offloading enabled
- Commit 8b6dd26 pushed
- Space rebuilding

### 19:05 UTC - Building
- Space status: APP_STARTING
- Waiting for model to load

### Next Check: 19:06 UTC
- Expected: RUNNING status
- Will test generation

---

## 📞 Fallback Plan

If this fix doesn't work:

1. **Immediate:** Switch to smaller model
2. **Short-term:** Enable 8-bit quantization
3. **Long-term:** Upgrade to A100 hardware

---

## ✅ Success Criteria

**The fix is successful if:**
1. ✅ Space starts without OOM errors
2. ✅ Model loads completely (all 4 shards)
3. ✅ Image generation works
4. ✅ No crashes for 24 hours
5. ✅ Memory stays under 20GB GPU + manageable CPU

---

**Monitor Status:** Active (checking every 60 seconds)
**Next Action:** Wait for Space to reach RUNNING state, then test generation

**ETA to RUNNING:** 1-3 minutes from APP_STARTING
