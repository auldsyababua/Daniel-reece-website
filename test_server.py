import requests
import sys

def test_server_status():
    """Test if server is running and responding"""
    try:
        response = requests.get('http://localhost:5000')
        if response.status_code == 200:
            print("✅ Server is running and responding")
            return True
        else:
            print(f"❌ Server responded with status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Failed to connect to server at http://localhost:5000")
        return False

def test_css_loading():
    """Test if CSS files are being properly served from Hugo build"""
    try:
        # Check various CSS files
        css_files = [
            'fixed.css',
            'style.css',
            'main.css',
            'base.css'
        ]
        
        success_count = 0
        
        for css_file in css_files:
            css_url = f'http://localhost:5000/css/{css_file}'
            response = requests.get(css_url)
            if response.status_code == 200:
                print(f"✅ Found CSS file: {css_file}")
                
                # Check if the file actually contains CSS content
                content = response.text.lower()
                if '{' in content and '}' in content:
                    print(f"✅ {css_file} contains valid CSS content")
                    success_count += 1
                else:
                    print(f"❌ {css_file} appears to be empty or invalid")
            else:
                print(f"❌ CSS file {css_file} returned status code {response.status_code}")
        
        # Check for CSS references in the HTML
        html_response = requests.get('http://localhost:5000')
        html_content = html_response.text.lower()
        
        css_references = [
            'link rel="stylesheet"',
            '.css"'
        ]
        
        # Check for either absolute or relative CSS paths
        css_path_patterns = [
            'href="/css/',  # Absolute path
            'href="./css/',  # Relative path with dot
            'href="../css/'  # Relative path with parent
        ]
        
        all_refs_found = True
        for ref in css_references:
            if ref in html_content:
                print(f"✅ HTML contains CSS reference: {ref}")
            else:
                print(f"❌ HTML missing CSS reference: {ref}")
                all_refs_found = False
                
        # Check if at least one CSS path pattern is found
        css_path_found = False
        for path_pattern in css_path_patterns:
            if path_pattern in html_content:
                print(f"✅ HTML contains CSS path pattern: {path_pattern}")
                css_path_found = True
                break
        
        if not css_path_found:
            print("❌ HTML missing any recognized CSS path pattern")
            all_refs_found = False
        
        return success_count > 0 and all_refs_found
    
    except requests.exceptions.ConnectionError:
        print("❌ Failed to connect to server for CSS testing")
        return False

def test_html_content():
    """Test if HTML contains expected elements for Hugo site"""
    try:
        response = requests.get('http://localhost:5000')
        content = response.text.lower()
        
        # Basic HTML structure tests
        basic_sections = {
            "html document": "<!doctype html" in content,
            "head section": "<head" in content,
            "body section": "<body" in content,
            "css links": "<link" in content and "css" in content,
            "javascript": "<script" in content
        }
        
        # Specific content tests for our site
        specific_elements = {
            "site title": "daniel reece" in content,
            "navigation elements": "<nav" in content,
            "main content area": "<main" in content,
            "bg-navy class": "bg-navy" in content,
            "text-gold class": "text-gold" in content
        }
        
        # Check for the presence of key site sections
        site_sections = {
            "hero section": ("hero" in content) or ("<section" in content and "class=" in content),
            "intro section": "intro" in content,
            "services": "services" in content or "coaching" in content,
            "footer": "<footer" in content
        }
        
        print("\n--- Basic HTML Structure ---")
        basic_passed = True
        for section, passed in basic_sections.items():
            if passed:
                print(f"✅ Found {section} in HTML")
            else:
                print(f"❌ Could not find {section} in HTML")
                basic_passed = False
        
        print("\n--- Specific Site Elements ---")
        elements_passed = True
        for element, passed in specific_elements.items():
            if passed:
                print(f"✅ Found {element} in HTML")
            else:
                print(f"❌ Could not find {element} in HTML")
                elements_passed = False
        
        print("\n--- Site Sections ---")
        sections_passed = True
        for section, passed in site_sections.items():
            if passed:
                print(f"✅ Found {section} in HTML")
            else:
                print(f"❌ Could not find {section} in HTML")
                sections_passed = False
        
        # Check for YouTube embed as seen in the screenshot
        if "youtube" in content and "iframe" in content:
            print("✅ Found YouTube embed in HTML")
            youtube_passed = True
        else:
            print("❌ Could not find YouTube embed in HTML")
            youtube_passed = False
            
        return basic_passed and elements_passed and sections_passed and youtube_passed
    
    except requests.exceptions.ConnectionError:
        print("❌ Failed to connect to server for HTML content test")
        return False

if __name__ == "__main__":
    print("Running tests on the web server...")
    server_running = test_server_status()
    
    if server_running:
        css_loading = test_css_loading()
        html_content = test_html_content()
        
        if css_loading and html_content:
            print("\n✅ All tests passed! The server appears to be working correctly.")
            sys.exit(0)
        else:
            print("\n❌ Some tests failed. Please check the details above.")
            sys.exit(1)
    else:
        print("\n❌ Server test failed. Cannot proceed with further tests.")
        sys.exit(1)