from diffusers import AutoPipelineForText2Image
import torch

# Load the base model
pipeline = AutoPipelineForText2Image.from_pretrained("/share/LLMs/stable-diffusion-2-1", torch_dtype=torch.float16, variant="fp16").to("cuda")

# Load the LoRA weights
lora_weights = torch.load("/gfshome/stable-diffusion-webui/models/Lora/furina-focalors-v2e1x.safetensors")

# Merge the LoRA weights with the base model
for name, param in pipeline.named_parameters():
    if name in lora_weights:
        param.data += lora_weights[name].data

# Generate an image with the modified pipeline
output = pipeline("furina, 1 girl, centered composition, masterpiece, photorealistic, 8k")

for image in output.images:
    image.save("output.jpg")