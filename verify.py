import sys
import os
import py_compile
import subprocess

def check_python_files(root_dir):
    print(f"Checking Python files syntax in {root_dir}...")
    errors = 0
    for root, dirs, files in os.walk(root_dir):
        if 'venv' in root or '.venv' in root or '__pycache__' in root:
            continue
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                try:
                    py_compile.compile(filepath, doraise=True)
                    print(f"  [OK] {filepath}")
                except py_compile.PyCompileError as e:
                    print(f"  [ERROR] Syntax error in {filepath}:\n{str(e)}")
                    errors += 1
    return errors

def check_node_files(root_dir):
    print(f"\nChecking Node.js files syntax in {root_dir}...")
    errors = 0
    js_files = []
    
    # Locate all JS files in src folder
    src_dir = os.path.join(root_dir, "src")
    if not os.path.exists(src_dir):
        print(f"  [ERROR] Node.js src directory not found at: {src_dir}")
        return 1
        
    for root, dirs, files in os.walk(src_dir):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))

    if not js_files:
        print("  [WARNING] No JavaScript files found to check.")
        return 0

    for filepath in js_files:
        try:
            # Run node --check filepath to dry-run compile each JS file
            res = subprocess.run(["node", "--check", filepath], capture_output=True, text=True)
            if res.returncode != 0:
                print(f"  [ERROR] Syntax error in {filepath}:\n{res.stderr}")
                errors += 1
            else:
                print(f"  [OK] {filepath}")
        except Exception as e:
            print(f"  [ERROR] Failed to run syntax check for {filepath}: {str(e)}")
            errors += 1
            
    return errors

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    ai_service_dir = os.path.join(current_dir, "ai-service")
    backend_dir = os.path.join(current_dir, "backend")
    
    has_errors = False
    
    if os.path.exists(ai_service_dir):
        py_errors = check_python_files(os.path.join(ai_service_dir, "app"))
        if py_errors > 0:
            has_errors = True
    else:
        print(f"[WARNING] ai-service directory not found at {ai_service_dir}")
        
    if os.path.exists(backend_dir):
        node_errors = check_node_files(backend_dir)
        if node_errors > 0:
            has_errors = True
    else:
        print(f"[WARNING] backend directory not found at {backend_dir}")

    if has_errors:
        print("\n[FAIL] Verification complete. Syntax errors were found.")
        sys.exit(1)
    else:
        print("\n[SUCCESS] All Python and Node.js files compiled cleanly!")
        sys.exit(0)
