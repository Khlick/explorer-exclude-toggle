import os
import shutil

def remove_directory(dir_path):
    if os.path.exists(dir_path) and os.path.isdir(dir_path):
        shutil.rmtree(dir_path)
        print(f"Removed directory: {dir_path}")

def remove_file(file_path):
    if os.path.exists(file_path) and os.path.isfile(file_path):
        os.remove(file_path)
        print(f"Removed file: {file_path}")

def clean_project():
    project_root = os.path.dirname(os.path.abspath(__file__))

    # Directories to remove
    directories_to_remove = [
        os.path.join(project_root, 'node_modules'),
        os.path.join(project_root, 'dist'),
        os.path.join(project_root, 'out')
    ]

    # Files to remove
    files_to_remove = [
        os.path.join(project_root, 'package-lock.json')
    ]

    for directory in directories_to_remove:
        remove_directory(directory)

    for file in files_to_remove:
        remove_file(file)

if __name__ == "__main__":
    clean_project()
