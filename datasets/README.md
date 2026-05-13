# Lumina Health AI Datasets Guide

## Scalable Dataset Architecture

This project is designed to handle multiple medical imaging and tabular datasets.
The structure is modular to support separate training pipelines for every disease.

### Directory Structure
```text
datasets/
├── pneumonia/
│   ├── train/
│   │   ├── NORMAL/
│   │   └── PNEUMONIA/
│   ├── validation/
│   └── test/
├── brain_tumor/
│   ├── train/
│   │   ├── YES/
│   │   └── NO/
│   ├── validation/
│   └── test/
... and so on for all 12 diseases.
```

### Supported Diseases
1. Pneumonia
2. Brain Tumor
3. Bone Fracture
4. Skin Diseases
5. Breast Cancer
6. Tuberculosis
7. Kidney Disease
8. Heart Disease
9. Lung Cancer
10. Diabetes
11. Liver Disease
12. Eye Diseases

### Dataset Acquisition
We recommend sourcing datasets from:
- [Kaggle Medical Datasets](https://www.kaggle.com/datasets?search=medical)
- [NIH Clinical Center](https://clinicalcenter.nih.gov/drd/index.html)
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php)

### Formatting Rules
- Images should be resized to 224x224 for CNN backbones.
- Normalize pixel values to [0, 1] or [-1, 1].
- Tabular data (Diabetes, etc.) should be stored as normalized CSVs.

### Dataset Integrity Check
Use our built-in dataset manager to verify your local files:
`python backend/utils/dataset_manager.py --verify pneumonia`
