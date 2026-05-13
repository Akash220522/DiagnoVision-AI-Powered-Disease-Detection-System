import os

def check_dataset_health(disease_name):
    base_path = f"datasets/{disease_name}"
    folders = ['train', 'validation', 'test']
    
    print(f"--- LUMINA DATASET MANAGER: {disease_name.upper()} ---")
    
    if not os.path.exists(base_path):
        print(f"❌ Error: Dataset folder '{base_path}' not found!")
        return

    for folder in folders:
        fpath = os.path.join(base_path, folder)
        if os.path.exists(fpath):
            count = sum([len(files) for r, d, files in os.walk(fpath)])
            print(f"✅ {folder.capitalize()}: {count} files detected.")
        else:
            print(f"⚠️ Warning: Missing {folder} folder.")

def create_structure():
    diseases = [
        "pneumonia", "brain_tumor", "fracture", "skin", "breast_cancer",
        "tuberculosis", "kidney", "heart", "lung", "diabetes", "liver", "eye"
    ]
    for d in diseases:
        for f in ['train', 'validation', 'test']:
            path = f"datasets/{d}/{f}"
            os.makedirs(path, exist_ok=True)
    print("✅ Full 12-disease dataset structure initialized.")

if __name__ == "__main__":
    create_structure()
