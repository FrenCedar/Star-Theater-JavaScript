#!/usr/bin/env python3
"""
Build Tool for Digistar Show Scripts
Combines lighting functions with your show code into one runnable file
"""

import sys
import os
from datetime import datetime

def extract_functions_from_master():
    """Extract just the functions from lighting_master.js"""
    master_file = "lighting_master.js"
    
    if not os.path.exists(master_file):
        print(f"Error: {master_file} not found!")
        return None
    
    with open(master_file, 'r') as f:
        content = f.read()
    
    # Extract everything up to "INITIALIZATION" section
    init_marker = "// ===== INITIALIZATION ====="
    if init_marker in content:
        functions_only = content.split(init_marker)[0]
    else:
        functions_only = content
    
    return functions_only.strip()

def build_show(show_file, output_file=None):
    """
    Combine lighting functions with a show script
    
    Args:
        show_file: Path to your show script
        output_file: Output file name (optional, auto-generated if not provided)
    """
    
    # Check if show file exists
    if not os.path.exists(show_file):
        print(f"Error: Show file '{show_file}' not found!")
        return False
    
    # Read show script
    with open(show_file, 'r') as f:
        show_content = f.read()
    
    # Get functions from master
    functions = extract_functions_from_master()
    if not functions:
        return False
    
    # Auto-generate output filename if not provided
    if not output_file:
        base_name = os.path.splitext(os.path.basename(show_file))[0]
        output_file = f"built_{base_name}.js"
    
    # Build combined file
    header = f"""// ============================================
// BUILT SHOW SCRIPT
// Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// Source: {show_file}
// ============================================

"""
    
    separator = """

// ============================================
// SHOW SCRIPT STARTS HERE
// ============================================

"""
    
    combined = header + functions + separator + show_content
    
    # Write output file
    with open(output_file, 'w') as f:
        f.write(combined)
    
    print(f"✓ Successfully built: {output_file}")
    print(f"  Source: {show_file}")
    print(f"  Size: {len(combined)} characters")
    print(f"\nYou can now run '{output_file}' in Digistar!")
    
    return True

def build_from_template(show_name):
    """Create a new show from template"""
    
    template_file = "show_template.js"
    if not os.path.exists(template_file):
        print(f"Error: {template_file} not found!")
        return False
    
    # Read template
    with open(template_file, 'r') as f:
        content = f.read()
    
    # Replace placeholders
    content = content.replace('var SHOW_NAME = "My Show Name";', 
                            f'var SHOW_NAME = "{show_name}";')
    
    # Output filename
    safe_name = show_name.lower().replace(' ', '_')
    output_file = f"{safe_name}.js"
    
    # Check if file already exists
    if os.path.exists(output_file):
        response = input(f"File '{output_file}' already exists. Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled.")
            return False
    
    # Write new show file
    with open(output_file, 'w') as f:
        f.write(content)
    
    print(f"✓ Created new show: {output_file}")
    print(f"\nNext steps:")
    print(f"  1. Edit '{output_file}' and customize your show")
    print(f"  2. Run: python build_show.py {output_file}")
    print(f"  3. Load the built file in Digistar!")
    
    return True

def main():
    """Main entry point"""
    
    print("=" * 50)
    print("Digistar Show Builder")
    print("=" * 50)
    print()
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Build a show:")
        print("    python build_show.py <show_file.js> [output_file.js]")
        print()
        print("  Create from template:")
        print("    python build_show.py --new \"My Show Name\"")
        print()
        print("Examples:")
        print("  python build_show.py my_show.js")
        print("  python build_show.py my_show.js output.js")
        print("  python build_show.py --new \"Basketball Intro\"")
        return
    
    # Check for --new flag
    if sys.argv[1] == "--new" or sys.argv[1] == "-n":
        if len(sys.argv) < 3:
            print("Error: Show name required!")
            print("Usage: python build_show.py --new \"Show Name\"")
            return
        
        show_name = sys.argv[2]
        build_from_template(show_name)
        return
    
    # Build show
    show_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    build_show(show_file, output_file)

if __name__ == "__main__":
    main()
