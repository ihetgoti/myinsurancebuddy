import os
import re

def check_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        if '<Users' in content:
            # Check imports
            import_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+'lucide-react'", content)
            if import_match:
                imports = import_match.group(1)
                if 'Users' not in imports:
                    print(f"Missing Users import: {filepath}")
            else:
                print(f"No lucide-react imports found but Users used: {filepath}")
                
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

root_dir = '/Users/hetgoti/Het@Peersonal/myinsurancebuddy/apps/web/app/guides'
for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith('.tsx'):
            check_file(os.path.join(dirpath, filename))
