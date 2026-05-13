import os
import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# --- CONFIGURATION ---
DISEASE_NAME = "pneumonia"
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_PATH = f"../../datasets/{DISEASE_NAME}/"
MODEL_SAVE_PATH = f"../models/model_{DISEASE_NAME}.h5"

def load_data():
    print(f"🔄 Loading {DISEASE_NAME} dataset...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(DATASET_PATH, 'train'),
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(DATASET_PATH, 'validation'),
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )
    return train_ds, val_ds

def create_model():
    print("🧠 Initializing CNN Architecture...")
    model = models.Sequential([
        layers.Rescaling(1./255, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D(),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid') # Binary classification for Pneumonia
    ])
    
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    return model

if __name__ == "__main__":
    train_ds, val_ds = load_data()
    model = create_model()
    
    print("🚀 Starting training pipeline...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS
    )
    
    print(f"✅ Training complete. Saving model to {MODEL_SAVE_PATH}")
    model.save(MODEL_SAVE_PATH)
    
    # Save Analytics
    plt.plot(history.history['accuracy'], label='accuracy')
    plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend(loc='lower right')
    plt.savefig(f"../analytics/{DISEASE_NAME}_performance.png")
