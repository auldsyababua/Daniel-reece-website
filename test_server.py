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
        # Check for CSS in the css directory (Hugo standard)
        response = requests.get('http://localhost:5000/css/')
        
        if response.status_code == 200:
            print("✅ CSS directory is accessible")
            
            # Look for any CSS file in the directory listing
            content = response.text.lower()
            if '.css' in content:
                print("✅ CSS files found in the css directory")
                return True
            else:
                print("❌ No CSS files found in the css directory")
                return False
        else:
            print(f"❌ CSS directory request returned status code {response.status_code}")
            
            # Try direct access to a potential main CSS file
            alt_response = requests.get('http://localhost:5000/css/styles.css')
            if alt_response.status_code == 200:
                print("✅ Found CSS file at /css/styles.css")
                return True
            else:
                print("❌ Could not find CSS files")
                return False
    except requests.exceptions.ConnectionError:
        print("❌ Failed to connect to server for CSS file")
        return False

def test_html_content():
    """Test if HTML contains expected elements for Hugo site"""
    try:
        response = requests.get('http://localhost:5000')
        content = response.text.lower()
        
        # For a Hugo site, we should check for different elements
        sections = {
            "html document": "<!doctype html" in content,
            "head section": "<head" in content,
            "body section": "<body" in content,
            "css links": "<link" in content and "css" in content,
            "javascript": "<script" in content
        }
        
        all_passed = True
        for section, passed in sections.items():
            if passed:
                print(f"✅ Found {section} in HTML")
            else:
                print(f"❌ Could not find {section} in HTML")
                all_passed = False
        
        return all_passed
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